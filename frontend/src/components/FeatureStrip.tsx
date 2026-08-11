import { FileText, Grid3x3, Zap, Target, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

interface Feature {
  icon: ComponentType<{ size?: number; className?: string }>;
  color: string;
  label: string;
  value: string;
  hint: string;
}

const features: Feature[] = [
  { icon: FileText, color: "text-cyan-300", label: "Formatos", value: "XLSX, XLS, CSV", hint: "Suporte completo" },
  { icon: Grid3x3, color: "text-blue-300", label: "Até", value: "50.000+ linhas", hint: "Por planilha" },
  { icon: Zap, color: "text-yellow-300", label: "Processamento", value: "0,8s", hint: "Tempo médio" },
  { icon: Target, color: "text-purple-300", label: "Precisão", value: "100%", hint: "Algoritmo exato" },
  { icon: ShieldCheck, color: "text-green-300", label: "Segurança", value: "Nível bancário", hint: "Seus dados protegidos" },
];

export function FeatureStrip() {
  return (
    <div className="mt-8 grid w-full max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {features.map(({ icon: Icon, color, label, value, hint }) => (
        <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-white/5 px-4 py-4 backdrop-blur-xl">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 ${color}`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="text-sm font-semibold text-white">{value}</p>
            <p className="text-xs text-slate-500">{hint}</p>
          </div>
        </div>
      ))}
    </div>
  );
}