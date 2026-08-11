from pydantic import BaseModel


class ResultadoCombinacao(BaseModel):
    indices: list[int]
    valores: list[float]
    total: float


class RespostaConciliacao(BaseModel):
    sucesso: bool
    tempo_execucao: float
    quantidade_combinacoes: int
    resultados: list[ResultadoCombinacao]