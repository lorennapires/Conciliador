import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  erro: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { erro: null };

  static getDerivedStateFromError(erro: Error) {
    return { erro };
  }

  componentDidCatch(erro: Error, info: unknown) {
    console.error("Erro capturado pelo ErrorBoundary:", erro, info);
  }

  render() {
    if (this.state.erro) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#040816] p-8 text-center text-white">
          <h1 className="text-2xl font-bold text-pink-400">Ocorreu um erro</h1>

          <p className="mt-4 max-w-xl text-slate-300">
            {this.state.erro.message}
          </p>

          <pre className="mt-6 max-w-2xl overflow-auto rounded-xl bg-black/40 p-4 text-left text-xs text-slate-400">
            {this.state.erro.stack}
          </pre>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black"
          >
            Recarregar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}