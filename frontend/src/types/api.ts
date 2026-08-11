export interface SearchResult {
  valores: number[];
  indices: number[];
  total: number;
}

export interface SearchResponse {
  sucesso: boolean;
  tempo_execucao: number;
  quantidade_combinacoes: number;
  resultados: SearchResult[];
}

export interface ApiError {
  detalhe: string;
}   