import { useState } from "react";
import { DollarSign } from "lucide-react";

interface CurrencyInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

function formatCurrency(value: string) {
  const numbers = value.replace(/\D/g, "");

  if (!numbers) return "";

  const amount = (Number(numbers) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return amount;
}

export function CurrencyInput({
  value = "",
  onChange,
}: CurrencyInputProps) {
  const [internalValue, setInternalValue] = useState(value);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCurrency(event.target.value);

    setInternalValue(formatted);

    onChange?.(formatted);
  }

  return (
    <div className="mt-10">

      <label className="mb-3 block text-sm font-semibold tracking-wide text-cyan-300">

        Valor da conciliação

      </label>

      <div
        className="
        flex
        h-16
        items-center
        rounded-2xl
        border
        border-slate-700
        bg-[#081321]
        px-5
        transition-all
        duration-300
        focus-within:border-cyan-400
        focus-within:shadow-[0_0_30px_rgba(34,211,238,.25)]
        "
      >

        <DollarSign
          size={22}
          className="mr-3 text-cyan-400"
        />

        <input
          value={internalValue}
          onChange={handleChange}
          placeholder="0,00"
          className="
          h-full
          w-full
          bg-transparent
          text-2xl
          font-semibold
          tracking-wide
          text-white
          outline-none
          placeholder:text-slate-500
          "
        />

      </div>

      <p className="mt-2 text-xs text-slate-500">
        Digite o valor que deseja localizar na planilha.
      </p>

    </div>
  );
}