import { parseThemeFile, type ThemeOption, type ThemePalette } from "./palette";

/**
 * Builds what the root layout inlines for the themes: one CSS block per theme (so switching never
 * waits on the network) and a tiny script that restores the stored choice before first paint.
 * Call it from server code; the client gets plain `ThemeOption`s as props, so the TOML never ships
 * to the browser.
 */

/** A theme written as an omarchy `colors.toml` body. */
export type PaletteTheme = { name: string; label: string; toml: string; hidden?: boolean };

/** A theme with no palette, whose tokens are hand-written CSS on `[data-theme="<name>"]`. */
export type CssTheme = ThemeOption & { palette: ThemePalette };

export type ThemeHeadConfig = {
  themes: (PaletteTheme | CssTheme)[];
  /** The theme a first visit gets, and the one the server renders. */
  defaultTheme: string;
  /** Where the visitor's choice is remembered in localStorage. */
  storageKey: string;
};

/** Palette slots exposed to CSS as `--om-*`, the ones theme.css maps onto shadcn tokens. */
const PALETTE_SLOTS = [
  "accent",
  "on_accent",
  "on_red",
  "background",
  "dark_background",
  "darker_background",
  "lighter_background",
  "selection",
  "muted",
  "foreground",
  "dark_foreground",
  "light_foreground",
  "bright_foreground",
  "muted_foreground",
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "magenta",
  "brown",
];

const declarations = (palette: ThemePalette): string =>
  PALETTE_SLOTS.filter((slot) => palette[slot] !== undefined)
    .map((slot) => `--om-${slot.replaceAll("_", "-")}:${palette[slot]}`)
    .join(";");

const resolve = (theme: PaletteTheme | CssTheme): CssTheme => {
  if (!("toml" in theme)) return theme;
  const { name, label, toml, hidden } = theme;
  const { mode, palette } = parseThemeFile(toml);
  return { name, label, mode, palette, accent: palette.accent, canvas: palette.dark_background, hidden };
};

export function createThemeHead({ themes, defaultTheme, storageKey }: ThemeHeadConfig) {
  // The default leads, the rest follow alphabetically; the picker lists them in this order.
  const records = themes
    .map(resolve)
    .sort((a, b) => Number(b.name === defaultTheme) - Number(a.name === defaultTheme) || a.label.localeCompare(b.label));

  if (!records.some((theme) => theme.name === defaultTheme)) throw new Error(`unknown default theme "${defaultTheme}"`);

  const themeOptions: ThemeOption[] = records.map(({ name, label, mode, accent, canvas, hidden }) => ({
    name,
    label,
    mode,
    accent,
    canvas,
    ...(hidden ? { hidden } : {}),
  }));

  /** A theme with no palette styles itself from hand-written CSS instead. */
  const themeStyles = records
    .filter(({ palette }) => Object.keys(palette).length > 0)
    .map(({ name, palette }) => `[data-theme="${name}"]{${declarations(palette)}}`)
    .join("\n");

  const defaultThemeIsDark = records.find((theme) => theme.name === defaultTheme)?.mode === "dark";

  const modes = Object.fromEntries(records.map(({ name, mode }) => [name, mode]));

  /** Runs in <head> before paint. Mirrors `setTheme` in provider.tsx. */
  const themeScript = `(function(){try{var m=${JSON.stringify(modes)},r=document.documentElement,t=localStorage.getItem(${JSON.stringify(storageKey)});if(!Object.hasOwn(m,t))t=${JSON.stringify(defaultTheme)};r.dataset.theme=t;r.classList.toggle("dark",m[t]==="dark"||(m[t]==="system"&&matchMedia("(prefers-color-scheme: dark)").matches))}catch(e){}})()`;

  return { themeOptions, themeStyles, themeScript, defaultThemeIsDark };
}
