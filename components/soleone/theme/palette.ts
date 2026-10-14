export type ThemeMode = "dark" | "light" | "system";

/**
 * Theme palettes in the omarchy `colors.toml` format.
 *
 * Ported from the tasks app (products/tasks/src/backend/themePalette.ts) with the same slot
 * names and the same derivation rules, so a palette file from there is a valid theme here.
 * Pure module: no DOM, so the server can build CSS from it.
 *
 * Two names collide with shadcn and are mapped deliberately in theme.css: omarchy `accent`
 * is the brand color (our `--primary` and focus ring), while shadcn `--accent` is a quiet
 * hover surface and takes omarchy `selection`.
 */

/** Canonical omarchy slot name to hex color, for example `dark_background`. */
export type ThemePalette = Record<string, string>;

/** What the client needs to list a theme and draw its swatch. Colors are any CSS color. */
export type ThemeOption = {
  name: string;
  label: string;
  mode: ThemeMode;
  accent: string;
  canvas: string;
  /** Left out of the picker unless it is the active theme; something else on the site unlocks it. */
  hidden?: boolean;
};

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const ASSIGNMENT = /^([A-Za-z0-9_.-]+)[ \t]*=[ \t]*(.*)$/;
const MODES: readonly string[] = ["dark", "light", "system"];

type Rgb = { r: number; g: number; b: number };

function parseHexColor(value: string): Rgb {
  const digits = value.slice(1);
  const expanded = digits.length === 3 ? [...digits].map((digit) => digit + digit).join("") : digits;
  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

function toHex({ r, g, b }: Rgb): string {
  const channel = (value: number): string =>
    Math.round(Math.min(255, Math.max(0, value))).toString(16).padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

/** Expands three-digit hex so palettes reach the page in one shape. */
function normalizeHex(value: string): string {
  const digits = value.slice(1);
  if (digits.length !== 3) return value.toLowerCase();
  return `#${[...digits].map((digit) => digit + digit).join("")}`.toLowerCase();
}

function toLinear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function fromLinear(value: number): number {
  return value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055;
}

function relativeLuminance(value: string): number {
  const { r, g, b } = parseHexColor(value);
  return 0.2126 * toLinear(r / 255) + 0.7152 * toLinear(g / 255) + 0.0722 * toLinear(b / 255);
}

function contrastRatio(first: string, second: string): number {
  const a = relativeLuminance(first);
  const b = relativeLuminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Mixes in linear light: fraction 0 returns `first`, 1 returns `second`. */
function mixHex(first: string, second: string, fraction: number): string {
  const left = parseHexColor(first);
  const right = parseHexColor(second);
  const weight = Math.min(1, Math.max(0, fraction));
  const channel = (a: number, b: number): number =>
    fromLinear(toLinear(a / 255) + (toLinear(b / 255) - toLinear(a / 255)) * weight) * 255;
  return toHex({
    r: channel(left.r, right.r),
    g: channel(left.g, right.g),
    b: channel(left.b, right.b),
  });
}

/**
 * Mixes `from` toward `toward` in tenths until the result reads against every surface at
 * `target` contrast. Roles that carry text are corrected here rather than trusted.
 */
function readableMix(from: string, toward: string, surfaces: string[], target: number): string {
  for (let step = 0; step <= 10; step += 1) {
    const candidate = mixHex(from, toward, step / 10);
    if (surfaces.every((surface) => contrastRatio(candidate, surface) >= target)) return candidate;
  }
  return toward;
}

function paletteValue(rawValue: string): string | undefined {
  const value = rawValue.trim();
  const quote = value[0];
  if (quote === '"' || quote === "'") {
    const end = value.indexOf(quote, 1);
    return end > 0 ? value.slice(1, end) : undefined;
  }
  const comment = value.indexOf("#");
  const bare = (comment === -1 ? value : value.slice(0, comment)).trim();
  return bare === "" ? undefined : bare;
}

/** Reads the flat `key = "value"` subset of TOML that omarchy palettes use. */
function parseColorsToml(text: string): { palette: ThemePalette; mode?: ThemeMode } {
  const palette: ThemePalette = {};
  let mode: ThemeMode | undefined;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === "" || line.startsWith("#") || line.startsWith("[")) continue;
    const assignment = ASSIGNMENT.exec(line);
    const value = assignment ? paletteValue(assignment[2]) : undefined;
    if (!assignment || value === undefined) continue;

    if (assignment[1] === "mode") {
      if (MODES.includes(value)) mode = value as ThemeMode;
    } else {
      palette[assignment[1]] = value;
    }
  }

  return { palette, mode };
}

/**
 * Parses a palette file and fills the slots the page needs from the ones it declares:
 * `on_accent` and `on_red` (ink on a fill) and `muted_foreground` (secondary text) are
 * derived to stay readable, and a file may set any of them directly.
 */
export function parseThemeFile(text: string): { mode: ThemeMode; palette: ThemePalette } {
  const parsed = parseColorsToml(text);
  const colors: ThemePalette = {};
  for (const [key, value] of Object.entries(parsed.palette)) {
    if (HEX_COLOR.test(value)) colors[key] = normalizeHex(value);
  }

  const { background, foreground } = colors;
  if (!background || !foreground) throw new Error("a theme needs at least a background and a foreground");

  const mode = parsed.mode ?? (relativeLuminance(background) < 0.4 ? "dark" : "light");
  const dark = mode === "dark";
  const accent = colors.accent ?? colors.blue ?? foreground;
  const darkBackground = colors.dark_background
    ?? (dark ? mixHex(background, "#000000", 0.25) : mixHex(background, foreground, 0.05));
  const darkerBackground = colors.darker_background
    ?? (dark ? mixHex(background, "#000000", 0.45) : mixHex(background, foreground, 0.1));
  const lighterBackground = colors.lighter_background ?? mixHex(background, foreground, dark ? 0.12 : 0.06);
  const brightForeground = colors.bright_foreground ?? foreground;
  const darkForeground = colors.dark_foreground ?? mixHex(foreground, background, 0.45);

  // Ink on a fill is the theme's own darkest or lightest stop, whichever reads better. A fixed
  // lightness threshold misfires on mid-tone accents, where it picks light ink under 3:1 while
  // the dark stop clears 4.5:1.
  function inkOn(fill: string, darkStop: string, lightStop: string): string {
    return contrastRatio(fill, darkStop) >= contrastRatio(fill, lightStop) ? darkStop : lightStop;
  }
  const red = colors.red ?? (dark ? "#f87171" : "#b91c1c");

  return {
    mode,
    palette: {
      ...colors,
      accent,
      on_accent: colors.on_accent
        ?? inkOn(accent, dark ? darkerBackground : foreground, dark ? brightForeground : background),
      on_red: colors.on_red
        ?? inkOn(red, dark ? darkerBackground : foreground, dark ? brightForeground : background),
      selection: colors.selection ?? mixHex(background, foreground, dark ? 0.18 : 0.12),
      muted: colors.muted ?? mixHex(background, foreground, dark ? 0.3 : 0.22),
      dark_background: darkBackground,
      darker_background: darkerBackground,
      lighter_background: lighterBackground,
      dark_foreground: darkForeground,
      light_foreground: colors.light_foreground ?? mixHex(foreground, background, 0.15),
      bright_foreground: brightForeground,
      // Secondary text lands on the card, the canvas, and raised chips, and omarchy's
      // `dark_foreground` is usually too dim for all three.
      muted_foreground: colors.muted_foreground
        ?? readableMix(darkForeground, foreground, [background, darkBackground, lighterBackground], 4.5),
      red,
    },
  };
}
