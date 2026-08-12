import { Columns3 } from "lucide-react";

interface SeletorColunasProps {
  cabecalho: string[];
  colunasNumericas: number[];
  colunasSelecionadas: number[];
  onChange: (colunas: number[]) => void;
}

export function SeletorColunas({
  cabecalho,
  colunasNumericas,
  colunasSelecionadas,
  onChange,
}: SeletorColunasProps) {
  function alternar(col: number) {
    if (colunasSelecionadas.includes(col)) {
      onChange(colunasSelecionadas.filter((c) => c !== col));
    } else {
      onChange([...colunasSelecionadas, col].sort((a, b) => a - b));
    }
  }

  return (
    <div className="mt-8">

      <div className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-cyan-300">
        <Columns3 size={16} />
        Quais colunas têm os valores a somar?
      </div>

      <div className="max-h-56 overflow-y-auto rounded-2xl border border-slate-700 bg-[#081321] p-3">
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {colunasNumericas.map((col) => {
            const selecionada = colunasSelecionadas.includes(col);

            return (
              <label
                key={col}
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  selecionada ? "bg-cyan-500/10 text-cyan-200" : "text-slate-400 hover:bg-white/5"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selecionada}
                  onChange={() => alternar(col)}
                  className="h-4 w-4 shrink-0 accent-cyan-400"
                />
                <span className="truncate">
                  {cabecalho[col]} <span className="text-slate-500">(col. {col + 1})</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Já marquei as colunas mais prováveis. Desmarca as que não interessam ou marca outras.
      </p>

    </div>
  );
}