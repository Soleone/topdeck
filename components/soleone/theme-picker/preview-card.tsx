import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { ThemeMode, ThemeOption } from "@/components/soleone/theme"
import { grain } from "@/components/soleone/material/sheen"

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)")
const subscribeSystem = (listener: () => void) => {
  const query = darkQuery()
  query.addEventListener("change", listener)
  return () => query.removeEventListener("change", listener)
}

// A system theme draws the way the OS is set right now; the server has no OS, so it draws light.
function useDrawsDark(mode: ThemeMode) {
  const systemDark = useSyncExternalStore(
    subscribeSystem,
    () => darkQuery().matches,
    () => false,
  )
  return mode === "system" ? systemDark : mode === "dark"
}

// The card is a slab: thin slices behind the face show as its edge once the ring turns it.
const EDGE_SLICES = 3
// Few slices: each is a GPU layer on every card in the ring, which is what makes opening the picker slow.
const EDGE_STEP = 2 // px between slices, so the slab is about 6px thick

/**
 * A theme drawing itself: a small project card in that theme's own tokens, whatever theme the page
 * is in. It sets data-theme on itself (theme.css scopes every theme to [data-theme]), so it only
 * ever styles with tokens and never with `dark:`, which follows the page instead.
 *
 * With `depth`, it becomes a physical card for a 3D parent: the surface, text and button float at
 * their own heights (px times depth) and it gains thickness. Nothing inside may clip, since
 * overflow would flatten the layers back onto the face.
 *
 * `grain` gives the surface its texture; a card drawn many times over may leave it off, since it is
 * blended onto the card and that costs the GPU on every frame.
 *
 * With `selectable`, its Select button rises on hover (only where there is hover). `pressed` sinks it;
 * the owner sets it, since a press may come from a touch or a key, which CSS :active misses.
 */
/** The card's sample line: plain text, then a phrase drawn as selected text. */
export type ThemeTagline = { text: string; highlight: string }

const DEFAULT_TAGLINE: ThemeTagline = { text: "Small tools and games,", highlight: "built with care" }

export function ThemePreviewCard({
  theme,
  tagline = DEFAULT_TAGLINE,
  depth = 0,
  grain: grained = true,
  className,
  style,
  selectable = false,
  pressed = false,
  children,
}: {
  theme: ThemeOption
  tagline?: ThemeTagline
  depth?: number
  grain?: boolean
  selectable?: boolean
  pressed?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode // overlays drawn above every layer, such as glare
}) {
  const dark = useDrawsDark(theme.mode)
  const raised = depth > 0
  const lift = (px: number): CSSProperties | undefined =>
    raised ? { transform: `translateZ(${px * depth}px)` } : undefined

  return (
    <div
      data-theme={theme.name}
      className={cn(
        "relative flex flex-col rounded-3xl border border-black/[0.07] bg-background p-2 text-foreground select-none",
        "shadow-rim",
        dark && "dark border-white/10",
        raised && "transform-3d",
        className,
      )}
      style={{ colorScheme: dark ? "dark" : "light", ...style }}
    >
      {raised &&
        Array.from({ length: EDGE_SLICES }, (_, slice) => (
          <div
            key={slice}
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-3xl"
            style={{
              transform: `translateZ(${-(slice + 1) * EDGE_STEP}px)`,
              // Darker toward the back, so the edge reads as a side in shadow.
              background: `color-mix(in oklab, var(--background), black ${30 + slice * 13}%)`,
            }}
          />
        ))}
      {grained && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-3xl",
            dark ? "opacity-12 mix-blend-screen" : "opacity-7 mix-blend-multiply",
          )}
          style={{ backgroundImage: grain }}
        />
      )}

      {/* The page canvas around a card surface, the way the site sits a project card on the background. */}
      <div
        className={cn(
          "relative flex flex-1 flex-col justify-center rounded-inner bg-card p-3.5 text-card-foreground",
          "shadow-surface",
          raised && "transform-3d",
        )}
        style={lift(10)}
      >
        <div className="text-center" style={lift(6)}>
          <div className="truncate text-lg leading-tight font-semibold tracking-tight">{theme.label}</div>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {tagline.text} {/* Selected text, the way the theme highlights it. */}
            <span className="rounded-xs bg-(--selection) px-0.5 whitespace-nowrap text-(--selection-foreground)">
              {tagline.highlight}
            </span>
            .
          </p>
        </div>

        {/* Status badges: the success color and a quiet secondary surface. */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-3xs font-medium" style={lift(8)}>
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-success">
            <span className="size-1.5 rounded-full bg-current" />
            Live
          </span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">v1.2</span>
        </div>

        <div className="mt-5 flex items-center justify-center" style={lift(14)}>
          <span
            data-select
            className={cn(
              "inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground",
              "shadow-glow transition duration-150 ease-out",
              // Hover lights it up in place: brighter, with a soft halo of its own color around it.
              selectable &&
                !pressed &&
                "hover:shadow-glow-lifted hover:brightness-110",
              // Pressed it sinks into the card: shaded inside, its glow pulled in, a touch smaller.
              pressed &&
                "scale-[0.985] shadow-glow-pressed brightness-95 duration-75",
            )}
          >
            Select
          </span>
        </div>
      </div>

      {/* The eight tints the project cards draw from. */}
      <div className="flex items-center justify-between gap-1 px-1.5 pt-2 pb-0.5" style={lift(4)}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((tint) => (
          <span
            key={tint}
            className="h-1.5 flex-1 rounded-full shadow-swatch"
            style={{ background: `var(--tint-${tint})` }}
          />
        ))}
      </div>

      {children && (
        <div className="pointer-events-none absolute inset-0" style={lift(30)}>
          {children}
        </div>
      )}
    </div>
  )
}
