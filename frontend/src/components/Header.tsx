import { ShieldCheck } from "lucide-react";

function Logo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="20" r="10" stroke="url(#logoGradient)" strokeWidth="3" />
      <circle cx="25" cy="20" r="10" stroke="url(#logoGradient)" strokeWidth="3" />
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Header() {
  return (
    <header className="relative w-full pt-10">

      <div className="absolute right-6 top-10 flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-300">
        <ShieldCheck size={16} />
        Seus dados estão protegidos
      </div>

      <div className="flex flex-col items-center">

        <Logo />

        <span className="mt-2 text-sm font-semibold tracking-[0.3em] text-slate-300">
          CONCILIADOR
        </span>

        <h1 className="mt-6 text-center text-5xl font-black leading-tight text-white sm:text-6xl">
          Encontre combinações
          <br />
          em{" "}
          <span className="bg-gradient-to-r from-cyan-300 to-green-400 bg-clip-text text-transparent">
            segundos
          </span>
        </h1>

        <p className="mt-4 text-center text-lg text-slate-400">
          Inteligência para conciliações financeiras
        </p>

      </div>

    </header>
  );
}