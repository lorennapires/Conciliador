import { TechBackground } from "../components/background/TechBackground";
import { Header } from "../components/Header";
import { UploadCard } from "../components/cards/UploadCard";
import { FeatureStrip } from "../components/FeatureStrip";
import { BottomNav } from "../components/BottomNav";

export function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-y-auto overflow-x-hidden bg-[#030712]">
      <TechBackground />

      <div className="relative z-10 flex w-full flex-col items-center px-6">
        <Header />

        <div className="mt-10 flex w-full items-center justify-center">
          <UploadCard />
        </div>

        <FeatureStrip />

        <BottomNav />
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-full bg-gradient-to-t from-[#02040B] to-transparent" />
    </main>
  );
}