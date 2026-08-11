from fastapi import APIRouter, UploadFile, File, Form
from app.services.excel_service import ler_planilha
from app.algorithms.combination_search import encontrar_combinacoes
import time

router = APIRouter(prefix="/conciliar", tags=["Conciliação"])


@router.post("")
async def conciliar(
    file: UploadFile = File(...),
    valor: str = Form(...)
):
    inicio = time.time()

    alvo = (
        valor.replace(".", "")
        .replace(",", ".")
    )

    alvo = float(alvo)

    valores = ler_planilha(file)

    resultados = encontrar_combinacoes(
        valores=valores,
        alvo=alvo,
    )

    fim = time.time()

    return {
        "sucesso": True,
        "tempo_execucao": round(fim - inicio, 3),
        "quantidade_combinacoes": len(resultados),
        "resultados": resultados,
    }