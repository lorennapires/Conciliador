import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ExcelDropzone } from "../form/ExcelDropzone";
import { CurrencyInput } from "../form/CurrencyInput";

export function UploadCard() {
  function handleSearch() {
    console.log("Buscar combinações...");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="
      relative
      z-20
      w-full
      max-w-4xl
      overflow-hidden
      rounded-[36px]
      border
      border-cyan-400/20
      bg-white/5
      backdrop-blur-2xl
      shadow-[0_0_120px_rgba(0,140,255,.18)]
      "
    >
      {/* brilho superior */}
      <div
        className="
        absolute
        left-0
        top-0
        h-1
        w-full
        bg-gradient-to-r
        from-cyan-400
        via-blue-500
        via-green-400
        to-pink-500
        "
      />

      <div className="p-12">

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
          text-center
          text-6xl
          font-black
          tracking-wider
          "
        >
          <span
            className="
            bg-gradient-to-r
            from-cyan-300
            via-blue-500
            via-green-400
            to-pink-400
            bg-clip-text
            text-transparent
            "
          >
            CONCILIADOR
          </span>
        </motion.h1>

        <p className="mt-5 text-center text-lg text-slate-300">
          Inteligência para encontrar combinações automaticamente.
        </p>

        <div className="mt-12">

          <ExcelDropzone />

        </div>

        <CurrencyInput />

        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: "0px 0px 40px rgba(0,180,255,.45)",
          }}
          whileTap={{
            scale: .98,
          }}
          onClick={handleSearch}
          className="
          mt-10
          flex
          h-16
          w-full
          items-center
          justify-center
          gap-3
          rounded-2xl

          bg-gradient-to-r
          from-[#0047FF]
          via-[#008CFF]
          via-[#00C16A]
          to-[#FFE14A]

          text-lg
          font-bold
          text-white

          transition-all
          duration-300
          "
        >
          <Search size={22} />

          Buscar combinações
        </motion.button>

        <div className="mt-10 flex flex-wrap justify-center gap-3">

          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300">
            Excel
          </span>

          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            Conciliação Bancária
          </span>

          <span className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-300">
            Alta Performance
          </span>

          <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-2 text-sm text-pink-300">
            IA Assistida
          </span>

        </div>

      </div>
    </motion.div>
  );
}