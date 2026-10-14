import { createThemeHead } from "@/components/soleone/theme/head"
import { BUILTIN_THEMES } from "@/components/soleone/theme/palettes"
import { DEFAULT_THEME, THEME_STORAGE_KEY, TOPDECK_THEMES } from "./theme"

// What the root document inlines. The client gets `themeOptions` from the root loader, so the palettes
// never ship in the bundle.
export const themeHead = createThemeHead({
  themes: [...TOPDECK_THEMES, ...BUILTIN_THEMES],
  defaultTheme: DEFAULT_THEME,
  storageKey: THEME_STORAGE_KEY,
})
