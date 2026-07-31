import { motion } from "framer-motion";

const lines = [
  {
    top: "10%",
    width: 500,
    color: "from-transparent via-cyan-400 to-transparent",
    duration: 8,
    delay: 0,
  },
  {
    top: "22%",
    width: 350,
    color: "from-transparent via-blue-500 to-transparent",
    duration: 12,
    delay: 2,
  },
  {
    top: "38%",
    width: 600,
    color: "from-transparent via-green-500 to-transparent",
    duration: 10,
    delay: 1,
  },
  {
    top: "60%",
    width: 420,
    color: "from-transparent via-yellow-400 to-transparent",
    duration: 14,
    delay: 0,
  },
  {
    top: "76%",
    width: 520,
    color: "from-transparent via-pink-500 to-transparent",
    duration: 11,
    delay: 3,
  },
];

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* Glow Azul */}
      <div className="absolute -left-56 top-0 h-[650px] w-[650px] rounded-full bg-blue-700/25 blur-[180px]" />

      {/* Glow Royal */}
      <div className="absolute right-0 top-32 h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[170px]" />

      {/* Glow Verde */}
      <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[180px]" />

      {/* Glow Rosa */}
      <div className="absolute right-40 bottom-20 h-[350px] w-[350px] rounded-full bg-fuchsia-600/10 blur-[160px]" />

      {/* Glow Amarelo */}
      <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] rounded-full bg-yellow-400/10 blur-[140px]" />

      {/* Grade */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Linhas Animadas */}
      {lines.map((line, index) => (
        <motion.div
          key={index}
          className={`absolute h-[2px] bg-gradient-to-r ${line.color}`}
          style={{
            top: line.top,
            width: line.width,
          }}
          initial={{
            x: -700,
          }}
          animate={{
            x: 2200,
          }}
          transition={{
            duration: line.duration,
            repeat: Infinity,
            ease: "linear",
            delay: line.delay,
          }}
        />
      ))}

      {/* Partículas */}
      {Array.from({ length: 35 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute h-1 w-1 rounded-full bg-cyan-300"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.4,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4,
          }}
        />
      ))}

      {/* Círculos tecnológicos */}
      <motion.div
        className="absolute left-24 top-24 h-56 w-56 rounded-full border border-cyan-500/10"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute right-24 bottom-20 h-72 w-72 rounded-full border border-green-500/10"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 70,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}