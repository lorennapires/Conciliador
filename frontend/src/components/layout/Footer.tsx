import { motion } from "framer-motion";
import {
  History,
  Download,
  Settings,
  UserRound,
} from "lucide-react";

const items = [
  {
    icon: History,
    label: "Histórico",
  },
  {
    icon: Download,
    label: "Exportar",
  },
  {
    icon: Settings,
    label: "Configurações",
  },
  {
    icon: UserRound,
    label: "Conta",
  },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: .3 }}
      className="
      fixed
      bottom-8
      left-1/2
      -translate-x-1/2
      z-40

      flex
      items-center
      gap-8

      rounded-full

      border
      border-cyan-500/20

      bg-white/5

      px-8
      py-4

      backdrop-blur-2xl

      shadow-[0_0_35px_rgba(0,170,255,.15)]
      "
    >
      {items.map(({ icon: Icon, label }) => (
        <motion.button
          key={label}
          whileHover={{
            y: -4,
            scale: 1.05,
          }}
          whileTap={{
            scale: .95,
          }}
          className="
          group

          flex
          flex-col
          items-center

          gap-2

          text-slate-400

          transition-all

          hover:text-cyan-300
          "
        >
          <Icon
            size={22}
            className="
            transition-all
            group-hover:drop-shadow-[0_0_10px_rgb(34,211,238)]
            "
          />

          <span className="text-xs font-medium">
            {label}
          </span>
        </motion.button>
      ))}
    </motion.footer>
  );
}