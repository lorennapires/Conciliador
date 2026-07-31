from fastapi import FastAPI

app = FastAPI(
    title="Conciliador API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "API funcionando!"}

@app.get("/health")
def health():
    return {"status": "ok"}