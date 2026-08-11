import pandas as pd


def ler_planilha(file) -> list[float]:
    """
    Lê uma planilha Excel ou CSV e retorna todos os valores numéricos encontrados.
    """

    nome = file.filename.lower()

    if nome.endswith(".csv"):
        df = pd.read_csv(file.file)

    elif nome.endswith(".xlsx") or nome.endswith(".xls"):
        df = pd.read_excel(file.file)

    else:
        raise ValueError("Formato de arquivo não suportado.")

    valores = []

    for coluna in df.columns:

        serie = (
            df[coluna]
            .astype(str)
            .str.replace(".", "", regex=False)
            .str.replace(",", ".", regex=False)
        )

        numeros = pd.to_numeric(serie, errors="coerce").dropna()

        valores.extend(numeros.tolist())

    return [round(float(v), 2) for v in valores]