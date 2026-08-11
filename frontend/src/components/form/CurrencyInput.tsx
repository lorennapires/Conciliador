import { Calculator } from "lucide-react";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
}

function formatCurrency(value: string) {
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return "";
  return (Number(numbers) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function CurrencyInput({ value, onChange }: CurrencyInputProps) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(formatCurrency(event.target.value));
  }

  return (
    <div className="mt-10">
      <label className="mb-3 block text-sm font-semibold tracking-wide text-cyan-300">
        Valor a conciliar
      </label>

      <div className="flex h-16 items-center rounded-2xl border border-slate-700 bg-[#081321] px-5 transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_30px_rgba(34,211,238,.25)]">
        <span className="mr-3 text-lg font-bold text-slate-400">R$</span>

        <input
          value={value}
          onChange={handleChange}
          placeholder="0,00"
          className="h-full w-full bg-transparent text-2xl font-semibold tracking-wide text-white outline-none placeholder:text-slate-500"
        />

        <Calculator size={22} className="ml-3 text-slate-500" />
      </div>
    </div>
  );
}