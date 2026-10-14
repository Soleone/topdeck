import { motion, type MotionValue } from "motion/react"
import type { CSSProperties } from "react"

// A card's material: grain on the surface, and the glare and rim light that follow the pointer.

// SVG grain makes the surface read as a material instead of a flat fill.
export const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")"

// Cuts the rim gradient down to a ring as thick as the padding. Longhands only: the `mask` shorthand resets mask-composite.
const ring: CSSProperties = {
  maskImage: "linear-gradient(#000 0 0), linear-gradient(#000 0 0)",
  maskClip: "content-box, border-box",
  maskComposite: "exclude",
}

export function Sheen({
  glareX,
  glareY,
  rimAngle,
  shine,
  rimOpacity,
  glare,
  rim,
  rimWidth,
}: {
  glareX: MotionValue<string>
  glareY: MotionValue<string>
  rimAngle: MotionValue<number>
  shine: MotionValue<number>
  rimOpacity: MotionValue<number>
  glare: number
  rim: number
  rimWidth: number
}) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl mix-blend-soft-light"
        style={{ opacity: shine }}
      >
        <motion.div
          className="absolute -inset-1/2"
          style={{
            x: glareX,
            y: glareY,
            background: `radial-gradient(circle closest-side, rgb(255 255 255 / ${glare * 0.55}) 0%, rgb(255 255 255 / ${glare * 0.12}) 35%, transparent 85%)`,
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
        style={{ opacity: rimOpacity, padding: rimWidth, ...ring }}
      >
        {/* A square big enough to cover the card at any angle; rotating it turns the highlight toward the light. */}
        <motion.div
          className="absolute top-1/2 left-1/2 aspect-square w-[200%]"
          style={{
            x: "-50%",
            y: "-50%",
            rotate: rimAngle,
            background: `linear-gradient(0deg, rgb(255 255 255 / ${rim}) 16%, rgb(255 255 255 / 0) 45%)`,
          }}
        />
      </motion.div>
    </>
  )
}
