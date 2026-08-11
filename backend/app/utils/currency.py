def moeda_para_float(valor: str) -> float:
    """
    Converte:
    10.054,63 -> 10054.63
    """

    if not valor:
        return 0.0

    return float(
        valor.replace(".", "")
             .replace(",", ".")
             .strip()
    )


def float_para_moeda(valor: float) -> str:
    return f"{valor:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")