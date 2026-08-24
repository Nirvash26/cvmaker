"use client";

import { motion } from "framer-motion";

/**
 * Premium animated background for the Nirvash app.
 * Renders fixed-position ambient layers (video base, aurora orbs,
 * floating particles, grid pulse) behind all content.
 *
 * Theme-aware: uses CSS variables so it adapts to light/dark mode.
 */
export function AnimatedBackground() {
  // Generate stable particle positions
  const particles = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    left: (i * 53 + 7) % 100,
    size: 2 + (i % 3),
    duration: 18 + (i % 5) * 4,
    delay: -(i * 3) % 20,
    drift: (i % 7) * 30 - 90,
  }));

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Blurred video background layer (6px blur) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "blur(6px)", transform: "scale(1.1)" }}
      >
        <source src="/nirvash-bg.mp4" type="video/mp4" />
      </video>

      {/* Dark/light overlay tint over the video so it blends with theme */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, var(--nv-bg) 0%, color-mix(in srgb, var(--nv-bg) 70%, transparent) 50%, var(--nv-bg) 100%)",
          opacity: 0.85,
        }}
      />

      {/* Subtle animated grid */}
      <div
        className="absolute inset-0 grid-bg opacity-30"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
        }}
      />

      {/* Aurora orbs — slow drifting glow blobs */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.15, 0.95, 1],
          opacity: [0.3, 0.5, 0.35, 0.3],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[8%] w-[460px] h-[460px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--nv-accent), transparent 70%)" }}
      />

      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.9, 1.1, 1],
          opacity: [0.2, 0.4, 0.25, 0.2],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[40%] right-[5%] w-[420px] h-[420px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--nv-highlight), transparent 70%)" }}
      />

      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.1, 0.9, 1],
          opacity: [0.15, 0.3, 0.2, 0.15],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-[5%] left-[35%] w-[380px] h-[380px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, var(--nv-accent), transparent 70%)" }}
      />

      {/* Floating particles — small dots drifting upward */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "100vh", x: 0, opacity: 0 }}
          animate={{
            y: "-10vh",
            x: p.drift,
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: "var(--nv-highlight)",
            boxShadow: "0 0 6px var(--nv-highlight)",
          }}
        />
      ))}

      {/* Subtle vignette to deepen edges in dark mode */}
      <div
        className="absolute inset-0 dark:block hidden"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, var(--nv-bg) 100%)",
          opacity: 0.4,
        }}
      />
    </div>
  );
}

