import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { ResultadoConciliacao as ResultadoConciliacaoType } from "../../services/conciliacao";

interface Props {
  resultado: ResultadoConciliacaoType;
}

function formatarMoeda(valor: number | null | undefined) {
  if (typeof valor !== "number" || Number.isNaN(valor)) {
    return "—";
  }

  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ResultadoConciliacao({ resultado }: Props) {
  const {
    combinacoes_encontradas = [],
    valor_buscado,
    tolerancia,
    itens_considerados,
    total_itens_planilha,
  } = resultado ?? {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10"
    >
      <p className="mb-4 text-center text-sm text-slate-400">
        {itens_considerados ?? "?"} de {total_itens_planilha ?? "?"} valor(es) analisado(s) em busca de {formatarMoeda(valor_buscado)}
        {!!tolerancia && ` (tolerância de ± ${formatarMoeda(tolerancia)})`}
      </p>

      {combinacoes_encontradas.length === 0 ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-700 bg-black/20 p-6 text-slate-400">
          <XCircle size={22} className="text-pink-400" />
          Nenhuma combinação encontrada para esse valor.
        </div>
      ) : (
        <div className="space-y-4">
          {combinacoes_encontradas.map((combinacao, indice) => (
            <div
              key={indice}
              className="rounded-2xl border border-cyan-500/20 bg-black/20 p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 size={20} />
                  <span className="font-semibold">Combinação {indice + 1}</span>
                </div>

                <span className="text-sm text-slate-400">
                  Soma: {formatarMoeda(combinacao.soma)}
                  {combinacao.diferenca !== 0 && (
                    <span className="ml-2 text-amber-300">
                      ({combinacao.diferenca > 0 ? "+" : ""}{formatarMoeda(combinacao.diferenca)})
                    </span>
                  )}
                </span>
              </div>

              <ul className="space-y-2">
                {(combinacao.itens ?? []).map((item, i) => (
                  <li
                    key={`${item.linha}-${item.coluna}-${i}`}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm text-slate-200"
                  >
                    <div className="flex items-center gap-2">

                      <span className="rounded-md border border-slate-600 bg-slate-800/80 px-2 py-0.5 text-xs font-semibold text-slate-300">
                        Linha {item.linha}
                      </span>

                      <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                        Coluna {item.coluna_numero}
                      </span>

                    </div>

                    <span className="font-semibold text-cyan-300">
                      {formatarMoeda(item.valor)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}