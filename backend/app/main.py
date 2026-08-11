import io
import itertools
from typing import List, Optional

import pandas as pd
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Conciliador API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "API funcionando!"}


@app.get("/health")
def health():
    return {"status": "ok"}


# --- Conciliação ---

TOLERANCIA = 0.01
TAMANHO_MAX_COMBINACAO = 4
MAX_RESULTADOS = 5
MAX_ITENS_CONSIDERADOS = 40

COLUNAS_DESCRICAO_PROVAVEIS = [
    "descricao", "descrição", "description", "historico", "histórico", "nome", "item",
]


def _ler_planilha(nome_arquivo: str, conteudo: bytes) -> pd.DataFrame:
    extensao = nome_arquivo.lower().rsplit(".", 1)[-1] if "." in nome_arquivo else ""

    if extensao == "csv":
        return pd.read_csv(io.BytesIO(conteudo))

    if extensao in ("xlsx", "xls"):
        return pd.read_excel(io.BytesIO(conteudo))

    raise HTTPException(
        status_code=400,
        detail="Formato de arquivo não suportado. Envie .xlsx, .xls ou .csv.",
    )


def _detectar_colunas_valor(df: pd.DataFrame) -> List[str]:
    """Retorna TODAS as colunas numéricas da planilha (podem ser várias:
    ex. 'Débito' e 'Crédito', ou 'Valor A' e 'Valor B')."""
    colunas_numericas = df.select_dtypes(include="number").columns.tolist()

    if not colunas_numericas:
        raise HTTPException(
            status_code=400,
            detail="Não foi possível identificar nenhuma coluna numérica de valores na planilha.",
        )

    return colunas_numericas


def _detectar_coluna_descricao(df: pd.DataFrame, colunas_valor: List[str]) -> Optional[str]:
    for coluna in df.columns:
        if str(coluna).strip().lower() in COLUNAS_DESCRICAO_PROVAVEIS:
            return coluna

    for coluna in df.columns:
        if coluna not in colunas_valor and df[coluna].dtype == object:
            return coluna

    return None


def _buscar_combinacoes(itens: List[dict], valor_alvo: float) -> List[dict]:
    resultados: List[dict] = []

    for tamanho in range(1, TAMANHO_MAX_COMBINACAO + 1):
        for combinacao in itertools.combinations(itens, tamanho):
            soma = sum(item["valor"] for item in combinacao)

            if abs(soma - valor_alvo) <= TOLERANCIA:
                resultados.append({
                    "itens": list(combinacao),
                    "soma": round(soma, 2),
                    "diferenca": round(soma - valor_alvo, 2),
                })

                if len(resultados) >= MAX_RESULTADOS:
                    return resultados

    return resultados


@app.post("/conciliar")
async def conciliar(file: UploadFile = File(...), valor: float = Form(...)):
    conteudo = await file.read()

    df = _ler_planilha(file.filename or "", conteudo)

    if df.empty:
        raise HTTPException(status_code=400, detail="A planilha enviada está vazia.")

    colunas_valor = _detectar_colunas_valor(df)
    coluna_descricao = _detectar_coluna_descricao(df, colunas_valor)
    posicao_colunas = {nome: indice + 1 for indice, nome in enumerate(df.columns)}

    # Monta um item para CADA célula numérica preenchida, em CADA coluna de valor.
    # Assim, uma célula de 800 na coluna "Débito" e uma de 250 na coluna "Crédito"
    # entram no mesmo balaio de busca e podem aparecer juntas numa combinação.
    itens = []
    for indice, linha in df.iterrows():
        descricao_linha = str(linha[coluna_descricao]) if coluna_descricao else None

        for coluna in colunas_valor:
            valor_celula = linha[coluna]

            if pd.isna(valor_celula):
                continue

            try:
                valor_numerico = float(valor_celula)
            except (TypeError, ValueError):
                continue

            itens.append({
                "linha": int(indice) + 2,  # +2 considerando cabeçalho da planilha
                "coluna": str(coluna),
                "coluna_numero": posicao_colunas[coluna],
                "descricao": descricao_linha,
                "valor": round(valor_numerico, 2),
            })

    total_itens = len(itens)

    if total_itens == 0:
        raise HTTPException(
            status_code=400,
            detail="Nenhuma célula com valor numérico válido foi encontrada na planilha.",
        )

    itens_considerados = itens[:MAX_ITENS_CONSIDERADOS]

    combinacoes = _buscar_combinacoes(itens_considerados, valor)

    return {
        "valor_buscado": round(valor, 2),
        "colunas_valor": colunas_valor,
        "coluna_descricao": coluna_descricao,
        "total_itens_planilha": total_itens,
        "itens_considerados": len(itens_considerados),
        "combinacoes_encontradas": combinacoes,
    }