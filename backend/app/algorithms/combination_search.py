from typing import List


def encontrar_combinacoes(
    valores: List[float],
    alvo: float,
    tolerancia: float = 0.01,
    max_itens: int = 6,
):
    resultados = []

    valores_ordenados = sorted(
        enumerate(valores),
        key=lambda x: x[1],
        reverse=True,
    )

    def buscar(
        inicio,
        soma,
        indices,
        numeros,
    ):
        if abs(soma - alvo) <= tolerancia:

            resultados.append(
                {
                    "indices": indices.copy(),
                    "valores": numeros.copy(),
                    "total": round(soma, 2),
                }
            )

            return

        if soma > alvo + tolerancia:
            return

        if len(indices) >= max_itens:
            return

        for i in range(inicio, len(valores_ordenados)):

            indice_original, valor = valores_ordenados[i]

            buscar(
                i + 1,
                soma + valor,
                indices + [indice_original],
                numeros + [valor],
            )

    buscar(
        0,
        0,
        [],
        [],
    )

    resultados.sort(
        key=lambda x: (
            len(x["valores"]),
            abs(alvo - x["total"]),
        )
    )

    return resultados