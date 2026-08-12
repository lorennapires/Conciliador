import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Search } from "lucide-react";
import { ExcelDropzone } from "../form/ExcelDropzone";
import { CurrencyInput } from "../form/CurrencyInput";
import { SeletorColunas } from "../form/SeletorColunas";
import { Loading } from "../Loading";
import { ResultadoConciliacao } from "./ResultadoConciliacao";
import {
  lerPlanilha,
  buscarConciliacao,
  type EstruturaPlanilha,
  type ResultadoConciliacao as ResultadoConciliacaoType,
} from "../../services/conciliacao";

function parseValorParaNumero(valor: string): number {
  if (!valor) return 0;
  const normalizado = valor.replace(/\./g, "").replace(",", ".");
  return parseFloat(normalizado);
}

export function UploadCard() {
  const [file, setFile] = useState<File | null>(null);
  const [estrutura, setEstrutura] = useState<EstruturaPlanilha | null>(null);
  const [colunasSelecionadas, setColunasSelecionadas] = useState<number[]>([]);
  const [valor, setValor] = useState("");
  const [tolerancia, setTolerancia] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [lendoArquivo, setLendoArquivo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoConciliacaoType | null>(null);

  async function handleFileChange(novoArquivo: File | null) {
    setFile(novoArquivo);
    setEstrutura(null);
    setColunasSelecionadas([]);
    setResultado(null);
    setErro(null);

    if (!novoArquivo) return;

    setLendoArquivo(true);

    try {
      const estruturaLida = await lerPlanilha(novoArquivo);
      setEstrutura(estruturaLida);
      setColunasSelecionadas(estruturaLida.colunasSugeridas);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível ler essa planilha.");
      setFile(null);
    } finally {
      setLendoArquivo(false);
    }
  }

  async function handleSearch() {
    setErro(null);
    setResultado(null);

    if (!file || !estrutura) {
      setErro("Selecione uma planilha antes de buscar.");
      return;
    }

    if (colunasSelecionadas.length === 0) {
      setErro("Selecione ao menos uma coluna com os valores a somar.");
      return;
    }

    const valorNumerico = parseValorParaNumero(valor);

    if (!valorNumerico || valorNumerico <= 0) {
      setErro("Informe um valor válido para buscar.");
      return;
    }

    const toleranciaNumerica = tolerancia ? parseValorParaNumero(tolerancia) : 0;

    setCarregando(true);

    try {
      const data = buscarConciliacao(estrutura, colunasSelecionadas, valorNumerico, toleranciaNumerica);
      setResultado(data);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível concluir a conciliação. Verifique o arquivo e tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="relative z-20 w-full max-w-4xl overflow-hidden rounded-[36px] border border-cyan-400/20 bg-white/5 backdrop-blur-2xl shadow-[0_0_120px_rgba(0,140,255,.18)]"
    >
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-green-400" />

      <div className="p-12">
        <ExcelDropzone file={file} onFileChange={handleFileChange} />

        {lendoArquivo && (
          <p className="mt-4 text-center text-sm text-slate-400">Lendo planilha...</p>
        )}

        {estrutura && (
          <SeletorColunas
            cabecalho={estrutura.cabecalho}
            colunasNumericas={estrutura.colunasDisponiveis}
            colunasSelecionadas={colunasSelecionadas}
            onChange={setColunasSelecionadas}
          />
        )}

        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <CurrencyInput value={valor} onChange={setValor} label="Valor a conciliar" />
          <CurrencyInput value={tolerancia} onChange={setTolerancia} label="Tolerância (± R$, opcional)" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0px 0px 40px rgba(0,180,255,.45)" }}
          whileTap={{ scale: .98 }}
          onClick={handleSearch}
          disabled={carregando}
          className="mt-10 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#0047FF] via-[#00B8FF] to-[#00E68A] text-lg font-bold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Search size={22} />
          {carregando ? "Buscando..." : "Buscar combinações"}
        </motion.button>

        {carregando && <Loading />}

        {erro && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-pink-500/30 bg-pink-500/10 p-4 text-sm text-pink-300">
            <AlertCircle size={18} />
            {erro}
          </div>
        )}

        {resultado && !carregando && <ResultadoConciliacao resultado={resultado} />}
      </div>
    </motion.div>
  );
}