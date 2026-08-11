import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

const PALETTE = ["#22d3ee", "#3b82f6", "#34d399", "#a855f7"];

function hexToRgb(hex: string) {
  const value = parseInt(hex.slice(1), 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

export function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId: number;
    let lastFrameTime = 0;
    const FRAME_INTERVAL = 1000 / 30; // limita a ~30fps, suficiente pra um fundo decorativo

    canvas.width = width;
    canvas.height = height;

    const mouse = { x: width / 2, y: height / 2 };

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    window.addEventListener("mousemove", handleMouseMove);

    const particles: Particle[] = [];
    const amount = Math.min(45, Math.floor(width / 32));

    for (let i = 0; i < amount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.6 + 1,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      });
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    window.addEventListener("resize", resize);

    function drawGlow() {
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 620);
      g.addColorStop(0, "rgba(34,211,238,.10)");
      g.addColorStop(0.4, "rgba(59,130,246,.07)");
      g.addColorStop(0.7, "rgba(52,211,153,.04)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      drawGlow();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // "brilho" barato: um círculo maior e translúcido atrás do ponto sólido,
        // em vez de shadowBlur (que é muito custoso pro canvas recalcular a cada frame)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "33";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const { r, g, b } = hexToRgb(p.color);
            const alpha = ((120 - dist) / 120) * 0.18;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animate(time: number) {
      animationId = requestAnimationFrame(animate);

      if (time - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = time;

      draw();
    }

    animationId = requestAnimationFrame(animate);

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animationId = requestAnimationFrame(animate);
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 -z-30 bg-[#040816] pointer-events-none" />

      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,.20)_0%,transparent_45%),radial-gradient(circle_at_85%_15%,rgba(34,211,238,.14)_0%,transparent_45%),radial-gradient(circle_at_30%_90%,rgba(52,211,153,.14)_0%,transparent_45%),radial-gradient(circle_at_90%_85%,rgba(168,85,247,.10)_0%,transparent_45%)] pointer-events-none" />

      <div
        className="fixed inset-0 -z-20 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none" />
    </>
  );
}