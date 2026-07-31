import { AnimatedBackground } from "../components/background/AnimatedBackground";
import { UploadCard } from "../components/cards/UploadCard";

export function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712]">

      <AnimatedBackground />

      <div className="relative z-10 flex w-full items-center justify-center px-6">

        <UploadCard />

      </div>

      {/* Gradiente inferior */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-full bg-gradient-to-t from-[#02040B] to-transparent" />

    </main>
  );
}