import type { PaletteTheme } from "@/components/soleone/theme/head"

// The site's choices for the theme kit (components/soleone/theme, from the soleone registry).

/** The theme a first visit gets, and the one the server renders. */
export const DEFAULT_THEME = "topdeck"

/** Where the visitor's choice is remembered in localStorage. */
export const THEME_STORAGE_KEY = "topdeck.theme"

/** Where D lands on a side (dark or light) the visitor has not picked a theme on yet. */
export const HOTKEY_FALLBACKS = { dark: "topdeck-night", light: "topdeck" }

// The site's original shadcn slate look, light and dark, so a first visit looks as it always did.
export const TOPDECK_THEMES: PaletteTheme[] = [
  {
    name: "topdeck",
    label: "Topdeck",
    toml: `mode = "light"

accent = "#0f172a"
on_accent = "#f8fafc"
selection = "#f1f5f9"
muted = "#e2e8f0"

background = "#ffffff"
dark_background = "#ffffff"
darker_background = "#f8fafc"
lighter_background = "#f1f5f9"

foreground = "#020817"
bright_foreground = "#0f172a"
muted_foreground = "#64748b"

red = "#ef4444"
on_red = "#f8fafc"
yellow = "#ca8a04"
orange = "#ea580c"
green = "#16a34a"
cyan = "#0891b2"
blue = "#2563eb"
magenta = "#c026d3"`,
  },
  {
    name: "topdeck-night",
    label: "Topdeck Night",
    toml: `mode = "dark"

accent = "#f8fafc"
on_accent = "#0f172a"
selection = "#1e293b"
muted = "#334155"

background = "#020817"
dark_background = "#020817"
darker_background = "#01040c"
lighter_background = "#1e293b"

foreground = "#f8fafc"
bright_foreground = "#ffffff"
muted_foreground = "#94a3b8"

red = "#f87171"
yellow = "#facc15"
orange = "#fb923c"
green = "#4ade80"
cyan = "#22d3ee"
blue = "#60a5fa"
magenta = "#e879f9"`,
  },
]
