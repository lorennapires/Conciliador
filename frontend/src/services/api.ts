import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 60000,
});

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

export async function uploadPlanilha(
  file: File,
  valor: number,
): Promise<ResultadoConciliacao> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("valor", String(valor));

  const response = await api.post<ResultadoConciliacao>("/conciliar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}