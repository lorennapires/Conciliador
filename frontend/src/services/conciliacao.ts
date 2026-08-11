import * as XLSX from "xlsx";

export interface ItemConciliacao {
  linha: number;
  coluna: string;
  coluna_numero: number;
  descricao: string | null;
  valor: number;
}

export interface CombinacaoConciliacao {
  itens: ItemConciliacao[];
  soma: number;
  diferenca: number;
}

export interface ResultadoConciliacao {
  valor_buscado: number;
  colunas_valor: string[];
  coluna_descricao: string | null;
  total_itens_planilha: number;
  itens_considerados: number;
  combinacoes_encontradas: CombinacaoConciliacao[];
}

const TOLERANCIA = 0.001; // só cobre erro de arredondamento de ponto flutuante
const TAMANHO_MAX_COMBINACAO = 4;
const MAX_RESULTADOS = 5;
const MAX_ITENS_CONSIDERADOS = 40;

const COLUNAS_DESCRICAO_PROVAVEIS = [
  "descricao", "descrição", "description", "historico", "histórico", "nome", "item",
];

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

// Reconhece tanto células numéricas de verdade quanto células que o Excel
// guardou como TEXTO mas que são, na prática, um número (ex: "560,3", digitado
// numa célula formatada como texto — comum em planilhas exportadas ou coladas
// de outro lugar, principalmente em versões mais antigas do Excel).
function paraNumero(valor: unknown): number | null {
  if (typeof valor === "number") {
    return Number.isNaN(valor) ? null : valor;
  }

  if (typeof valor === "string") {
    const texto = valor.trim();
    if (texto === "") return null;

    // vírgula presente = formato BR (1.234,56 ou 560,3): tira pontos de milhar, troca vírgula por ponto
    const normalizado = texto.includes(",")
      ? texto.replace(/\./g, "").replace(",", ".")
      : texto;

    if (!/^-?\d+(\.\d+)?$/.test(normalizado)) return null;

    const numero = Number(normalizado);
    return Number.isNaN(numero) ? null : numero;
  }

  return null;
}

function lerArquivoComoArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.readAsArrayBuffer(file);
  });
}

// Gera combinações de tamanho `tamanho`, uma de cada vez (sem materializar tudo na
// memória), na mesma ordem que o itertools.combinations do Python.
function* gerarCombinacoes<T>(itens: T[], tamanho: number): Generator<T[]> {
  if (tamanho > itens.length || tamanho <= 0) return;

  const indices = Array.from({ length: tamanho }, (_, i) => i);

  while (true) {
    yield indices.map((i) => itens[i]);

    let i = tamanho - 1;
    while (i >= 0 && indices[i] === i + itens.length - tamanho) {
      i--;
    }
    if (i < 0) return;

    indices[i]++;
    for (let j = i + 1; j < tamanho; j++) {
      indices[j] = indices[j - 1] + 1;
    }
  }
}

function buscarCombinacoes(itens: ItemConciliacao[], valorAlvo: number): CombinacaoConciliacao[] {
  const resultados: CombinacaoConciliacao[] = [];

  for (let tamanho = 1; tamanho <= TAMANHO_MAX_COMBINACAO; tamanho++) {
    for (const combinacao of gerarCombinacoes(itens, tamanho)) {
      const soma = arredondar(combinacao.reduce((acc, item) => acc + item.valor, 0));

      if (Math.abs(soma - valorAlvo) <= TOLERANCIA) {
        resultados.push({
          itens: combinacao,
          soma,
          diferenca: arredondar(soma - valorAlvo),
        });

        if (resultados.length >= MAX_RESULTADOS) {
          return resultados;
        }
      }
    }
  }

  return resultados;
}

export async function conciliarPlanilha(file: File, valor: number): Promise<ResultadoConciliacao> {
  const extensao = file.name.toLowerCase().split(".").pop();

  if (!extensao || !["xlsx", "xls", "csv"].includes(extensao)) {
    throw new Error("Formato de arquivo não suportado. Envie .xlsx, .xls ou .csv.");
  }

  const buffer = await lerArquivoComoArrayBuffer(file);
  const workbook = XLSX.read(buffer, { type: "array" });

  const nomeAba = workbook.SheetNames[0];
  const planilha = workbook.Sheets[nomeAba];

  const linhas: unknown[][] = XLSX.utils.sheet_to_json(planilha, {
    header: 1,
    defval: null,
    raw: true,
  });

  if (linhas.length === 0) {
    throw new Error("A planilha enviada está vazia.");
  }

  const cabecalho = (linhas[0] as unknown[]).map((c) => String(c ?? "").trim());
  const dados = linhas.slice(1).filter((linha) => linha.some((celula) => celula !== null && celula !== ""));

  if (dados.length === 0) {
    throw new Error("A planilha enviada está vazia.");
  }

  // Uma coluna conta como "de valor" se pelo menos uma célula nela for numérica
  // (inclusive células de texto que são números, tipo "560,3").
  const colunasNumericas: number[] = [];
  for (let col = 0; col < cabecalho.length; col++) {
    const temNumero = dados.some((linha) => paraNumero(linha[col]) !== null);
    if (temNumero) colunasNumericas.push(col);
  }

  if (colunasNumericas.length === 0) {
    throw new Error("Não foi possível identificar nenhuma coluna numérica de valores na planilha.");
  }

  let colDescricao: number | null = null;

  for (let col = 0; col < cabecalho.length; col++) {
    if (COLUNAS_DESCRICAO_PROVAVEIS.includes(cabecalho[col].toLowerCase())) {
      colDescricao = col;
      break;
    }
  }

  if (colDescricao === null) {
    for (let col = 0; col < cabecalho.length; col++) {
      if (!colunasNumericas.includes(col) && dados.some((linha) => typeof linha[col] === "string")) {
        colDescricao = col;
        break;
      }
    }
  }

  const itens: ItemConciliacao[] = [];

  dados.forEach((linha, indice) => {
    const descricao = colDescricao !== null && linha[colDescricao] != null
      ? String(linha[colDescricao])
      : null;

    colunasNumericas.forEach((col) => {
      const numero = paraNumero(linha[col]);

      if (numero === null) {
        return;
      }

      itens.push({
        linha: indice + 2, // +2 considerando cabeçalho da planilha
        coluna: cabecalho[col] || `Coluna ${col + 1}`,
        coluna_numero: col + 1,
        descricao,
        valor: arredondar(numero),
      });
    });
  });

  const totalItens = itens.length;

  if (totalItens === 0) {
    throw new Error("Nenhuma célula com valor numérico válido foi encontrada na planilha.");
  }

  const itensConsiderados = itens.slice(0, MAX_ITENS_CONSIDERADOS);
  const combinacoes = buscarCombinacoes(itensConsiderados, valor);

  return {
    valor_buscado: arredondar(valor),
    colunas_valor: colunasNumericas.map((c) => cabecalho[c] || `Coluna ${c + 1}`),
    coluna_descricao: colDescricao !== null ? cabecalho[colDescricao] : null,
    total_itens_planilha: totalItens,
    itens_considerados: itensConsiderados.length,
    combinacoes_encontradas: combinacoes,
  };
}