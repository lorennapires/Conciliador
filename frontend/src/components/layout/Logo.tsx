import { motion } from "framer-motion";

export function Logo() {
  return (
    <div className="flex flex-col items-center">

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
        relative
        flex
        h-24
        w-24
        items-center
        justify-center
        "
      >
        {/* Anel externo */}
        <div
          className="
          absolute
          h-24
          w-24
          rounded-full
          border
          border-cyan-400/30
          "
        />

        {/* Anel interno */}
        <div
          className="
          absolute
          h-16
          w-16
          rounded-full
          border
          border-green-400/40
          "
        />

        {/* Núcleo */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="
          h-5
          w-5
          rounded-full
          bg-gradient-to-r
          from-cyan-400
          via-blue-500
          to-green-400
          shadow-[0_0_20px_rgb(34,211,238)]
          "
        />
      </motion.div>

      <h1
        className="
        mt-6
        bg-gradient-to-r
        from-cyan-300
        via-blue-400
        to-green-400
        bg-clip-text
        text-5xl
        font-black
        tracking-widest
        text-transparent
        "
      >
        CONCILIADOR
      </h1>

      <p className="mt-2 text-slate-400 tracking-wide">
        Inteligência para conciliação bancária
      </p>

    </div>
  );
}