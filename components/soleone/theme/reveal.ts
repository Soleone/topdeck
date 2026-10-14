"use client"

import { flushSync } from "react-dom"

const REVEAL_MS = 750 // how long the chosen theme takes to spread over the page

// Confirming spreads the new theme over the page from the chosen card: a circle that grows until it
// covers the far corner. A View Transition snapshots the page in the old theme and shows the new
// one through the circle (theme.css turns its default cross-fade off). Without View Transitions,
// or with reduced motion, the theme just switches.
export function revealTheme(apply: () => void, origin: { x: number; y: number } | undefined, reduced: boolean) {
  if (reduced || !origin || !("startViewTransition" in document)) return apply()
  const root = document.documentElement
  root.classList.add("theme-reveal")
  const transition = document.startViewTransition(() => flushSync(apply))
  const { x, y } = origin
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  transition.ready
    .then(() =>
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: REVEAL_MS, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
      ),
    )
    .catch(() => {})
  transition.finished.finally(() => root.classList.remove("theme-reveal"))
}
