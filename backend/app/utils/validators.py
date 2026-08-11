from fastapi import UploadFile

EXTENSOES_PERMITIDAS = {
    ".xlsx",
    ".xls",
    ".csv",
}


def validar_arquivo(file: UploadFile) -> bool:
    nome = file.filename.lower()

    return any(nome.endswith(ext) for ext in EXTENSOES_PERMITIDAS)


def validar_valor(valor: float) -> bool:
    return valor > 0