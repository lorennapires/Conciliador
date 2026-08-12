import * as XLSX from "xlsx";
import Papa from "papaparse";

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
  tolerancia: number;
  colunas_valor: string[];
  coluna_descricao: string | null;
  total_itens_planilha: number;
  itens_considerados: number;
  combinacoes_encontradas: CombinacaoConciliacao[];
}

export interface EstruturaPlanilha {
  cabecalho: string[];
  dados: unknown[][];
  colunasDisponiveis: number[];
  colunasSugeridas: number[];
  colunaDescricao: number | null;
}

const TAMANHO_MAX_COMBINACAO = 4;
const MAX_RESULTADOS = 5;
const MAX_ITENS_CONSIDERADOS = 60;

const COLUNAS_DESCRICAO_PROVAVEIS = [
  "descricao", "descrição", "description", "historico", "histórico", "nome", "item", "texto lancto",
];

const PALAVRAS_CHAVE_VALOR = [
  "valor", "débito", "debito", "crédito", "credito", "entrada", "saida", "saída",
  "pagamento", "pagam", "imposto", "desconto", "juros", "multa", "líquido", "liquido",
  "total", "montante", "baixa",
];

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

// Reconhece tanto células numéricas de verdade quanto células que a planilha
// guardou como TEXTO mas que são, na prática, um número (ex: "560,3", comum em
// exportações de sistemas e planilhas coladas de outro lugar).
function paraNumero(valor: unknown): number | null {
  if (typeof valor === "number") {
    return Number.isNaN(valor) ? null : valor;
  }

  if (typeof valor === "string") {
    const texto = valor.trim();
    if (texto === "") return null;

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

// Alguns sistemas (ERPs, exportações de SAP etc.) salvam CSV com os bytes
// duplamente convertidos: texto Latin-1/CP1252 (ç, ã, °, í...) re-salvo como
// se cada byte fosse um caractere Unicode, e então gravado como UTF-8. O
// resultado no arquivo é "mojibake" (ex: "Título" vira "TÃ­tulo"). Isso
// reverte esse processo quando detectado.
function corrigirMojibake(texto: string): string {
  if (!/[ÃÂ][\u0080-\u00BF]/.test(texto)) return texto; // sem sinal de mojibake, não mexe

  try {
    const bytes = Uint8Array.from([...texto].map((c) => c.charCodeAt(0)));
    const corrigido = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return corrigido;
  } catch {
    return texto; // não era mojibake de verdade, mantém original
  }
}

function todasColunasNumericas(cabecalho: string[], dados: unknown[][]): number[] {
  const numericas: number[] = [];

  for (let col = 0; col < cabecalho.length; col++) {
    if (dados.some((linha) => paraNumero(linha[col]) !== null)) {
      numericas.push(col);
    }
  }

  return numericas;
}

function sugerirColunasValor(cabecalho: string[], dados: unknown[][], numericas: number[]): number[] {
  // 1ª tentativa: colunas numéricas cujo nome bate com palavras típicas de valor
  const porNome = numericas.filter((col) => {
    const nome = cabecalho[col].toLowerCase();
    return PALAVRAS_CHAVE_VALOR.some((p) => nome.includes(p));
  });

  if (porNome.length > 0) return porNome;

  // fallback: colunas numéricas que não são sempre zero/vazias
  return numericas.filter((col) =>
    dados.some((linha) => {
      const n = paraNumero(linha[col]);
      return n !== null && n !== 0;
    })
  );
}

function sugerirColunaDescricao(cabecalho: string[], dados: unknown[][], colunasNumericas: number[]): number | null {
  for (let col = 0; col < cabecalho.length; col++) {
    if (COLUNAS_DESCRICAO_PROVAVEIS.includes(cabecalho[col].toLowerCase())) {
      return col;
    }
  }

  for (let col = 0; col < cabecalho.length; col++) {
    if (!colunasNumericas.includes(col) && dados.some((linha) => typeof linha[col] === "string")) {
      return col;
    }
  }

  return null;
}

export async function lerPlanilha(file: File): Promise<EstruturaPlanilha> {
  const extensao = file.name.toLowerCase().split(".").pop();

  if (!extensao || !["xlsx", "xls", "csv"].includes(extensao)) {
    throw new Error("Formato de arquivo não suportado. Envie .xlsx, .xls ou .csv.");
  }

  const buffer = await lerArquivoComoArrayBuffer(file);
  let linhas: unknown[][];

  if (extensao === "csv") {
    // CSV é tratado à parte com o PapaParse: o XLSX, ao ler CSV, tenta "adivinhar"
    // números automaticamente e interpreta vírgula decimal (formato BR, ex: "4571,26")
    // como separador de milhar, corrompendo o valor (virava 457126). O PapaParse com
    // dynamicTyping desligado mantém tudo como texto puro, e paraNumero() cuida da
    // conversão certa depois.
    const textoOriginal = new TextDecoder("utf-8").decode(buffer).replace(/^\uFEFF/, "");
    const textoCorrigido = corrigirMojibake(textoOriginal).replace(/^\uFEFF/, "");

    const resultado = Papa.parse<string[]>(textoCorrigido, {
      dynamicTyping: false,
      skipEmptyLines: true,
    });

    linhas = resultado.data;
  } else {
    const workbook = XLSX.read(buffer, { type: "array" });
    const nomeAba = workbook.SheetNames[0];
    const planilha = workbook.Sheets[nomeAba];

    linhas = XLSX.utils.sheet_to_json(planilha, {
      header: 1,
      defval: null,
      raw: true,
    });
  }

  if (linhas.length === 0) {
    throw new Error("A planilha enviada está vazia.");
  }

  const cabecalho = (linhas[0] as unknown[]).map((c, i) => {
    const nome = String(c ?? "").replace(/^\uFEFF/, "").trim();
    return nome || `Coluna ${i + 1}`;
  });

  const dados = linhas.slice(1).filter((linha) => linha.some((celula) => celula !== null && celula !== ""));

  if (dados.length === 0) {
    throw new Error("A planilha enviada está vazia.");
  }

  const colunasDisponiveis = todasColunasNumericas(cabecalho, dados);

  if (colunasDisponiveis.length === 0) {
    throw new Error("Não foi possível identificar nenhuma coluna numérica de valores na planilha.");
  }

  const colunasSugeridas = sugerirColunasValor(cabecalho, dados, colunasDisponiveis);
  const colunaDescricao = sugerirColunaDescricao(cabecalho, dados, colunasDisponiveis);

  return { cabecalho, dados, colunasDisponiveis, colunasSugeridas, colunaDescricao };
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

function buscarCombinacoes(itens: ItemConciliacao[], valorAlvo: number, tolerancia: number): CombinacaoConciliacao[] {
  const resultados: CombinacaoConciliacao[] = [];

  for (let tamanho = 1; tamanho <= TAMANHO_MAX_COMBINACAO; tamanho++) {
    for (const combinacao of gerarCombinacoes(itens, tamanho)) {
      const soma = arredondar(combinacao.reduce((acc, item) => acc + item.valor, 0));

      if (Math.abs(soma - valorAlvo) <= tolerancia) {
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

export function buscarConciliacao(
  estrutura: EstruturaPlanilha,
  colunasSelecionadas: number[],
  valor: number,
  tolerancia: number,
): ResultadoConciliacao {
  const { cabecalho, dados, colunaDescricao } = estrutura;

  if (colunasSelecionadas.length === 0) {
    throw new Error("Selecione ao menos uma coluna para buscar os valores.");
  }

  const itens: ItemConciliacao[] = [];

  dados.forEach((linha, indice) => {
    const descricao = colunaDescricao !== null && linha[colunaDescricao] != null
      ? String(linha[colunaDescricao])
      : null;

    colunasSelecionadas.forEach((col) => {
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
    throw new Error("Nenhuma célula com valor numérico válido foi encontrada nas colunas selecionadas.");
  }

  const itensConsiderados = itens.slice(0, MAX_ITENS_CONSIDERADOS);
  const combinacoes = buscarCombinacoes(itensConsiderados, valor, tolerancia);

  return {
    valor_buscado: arredondar(valor),
    tolerancia: arredondar(tolerancia),
    colunas_valor: colunasSelecionadas.map((c) => cabecalho[c] || `Coluna ${c + 1}`),
    coluna_descricao: colunaDescricao !== null ? cabecalho[colunaDescricao] : null,
    total_itens_planilha: totalItens,
    itens_considerados: itensConsiderados.length,
    combinacoes_encontradas: combinacoes,
  };
}