import { motion } from "framer-motion";
import { Search, LoaderCircle } from "lucide-react";

interface GradientButtonProps {
  loading?: boolean;
  onClick?: () => void;
}

export function GradientButton({
  loading = false,
  onClick,
}: GradientButtonProps) {
  return (
    <motion.button
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 45px rgba(0,180,255,.35)",
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={onClick}
      disabled={loading}
      className="
      relative
      overflow-hidden
      flex
      items-center
      justify-center
      gap-3

      h-16
      w-full

      rounded-2xl

      bg-gradient-to-r
      from-[#003cff]
      via-[#0088ff]
      via-[#00b86b]
      to-[#ffd93d]

      text-lg
      font-bold
      text-white

      transition-all
      duration-300

      disabled:opacity-70
      disabled:cursor-not-allowed
      "
    >
      <motion.div
        animate={{
          x: ["-120%", "220%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
        absolute
        inset-y-0
        w-28
        -skew-x-12
        bg-white/20
        blur-md
        "
      />

      {loading ? (
        <>
          <LoaderCircle
            size={22}
            className="animate-spin"
          />

          Processando...
        </>
      ) : (
        <>
          <Search size={22} />

          Buscar combinações
        </>
      )}
    </motion.button>
  );
}