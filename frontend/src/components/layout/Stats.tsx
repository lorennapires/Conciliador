import { motion } from "framer-motion";
import {
  Zap,
  Target,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";

const stats = [
  {
    icon: Zap,
    title: "100x mais rápido",
    description: "Encontre combinações em segundos.",
    color: "text-cyan-400",
  },
  {
    icon: Target,
    title: "Precisão Total",
    description: "Busca exata entre milhares de linhas.",
    color: "text-green-400",
  },
  {
    icon: FileSpreadsheet,
    title: "Excel",
    description: ".xlsx • .xls • .csv",
    color: "text-blue-400",
  },
  {
    icon: ShieldCheck,
    title: "Seguro",
    description: "Processamento protegido.",
    color: "text-yellow-400",
  },
];

export function Stats() {
  return (
    <section className="mt-20 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.15,
            }}
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            className="
              group
              rounded-3xl
              border
              border-cyan-500/10
              bg-white/5
              p-8
              backdrop-blur-xl
              transition-all
              duration-300
              hover:border-cyan-400/30
              hover:shadow-[0_0_40px_rgba(0,170,255,.15)]
            "
          >
            <div
              className="
                mb-6
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-slate-900/60
              "
            >
              <Icon
                size={32}
                className={`${item.color} transition-all group-hover:scale-110`}
              />
            </div>

            <h3 className="text-xl font-bold text-white">
              {item.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </section>
  );
}