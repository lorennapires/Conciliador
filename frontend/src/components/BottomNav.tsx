import { History, Download, Crown, Settings, User } from "lucide-react";

const items = [
  { icon: History, label: "Histórico", hint: null },
  { icon: Download, label: "Exportar resultados", hint: null },
  { icon: Crown, label: "Plano Premium", hint: "Mais combinações, mais poder", highlight: true },
  { icon: Settings, label: "Configurações", hint: null },
  { icon: User, label: "Minha conta", hint: null },
];

export function BottomNav() {
  return (
    <nav className="mt-6 flex w-full max-w-6xl flex-wrap items-center justify-center gap-3 border-t border-slate-800 pt-6 pb-4">
      {items.map(({ icon: Icon, label, hint, highlight }) => (
        <button
          key={label}
          className={`flex items-center gap-3 rounded-2xl px-5 py-3 text-left transition-colors ${
            highlight ? "border border-yellow-400/40 bg-yellow-400/5 text-yellow-300" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Icon size={20} />
          <div>
            <p className="text-sm font-medium">{label}</p>
            {hint && <p className="text-xs text-slate-500">{hint}</p>}
          </div>
        </button>
      ))}
    </nav>
  );
}