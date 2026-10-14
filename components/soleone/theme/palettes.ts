import type { PaletteTheme } from "./head";

/**
 * Built-in palettes, each an omarchy `colors.toml` body, shared with the tasks app
 * (products/tasks/src/backend/builtinThemes.ts). Keep them verbatim so a palette can be
 * pasted in either direction and run through the same parser. The last three (Copper Night, Game Boy,
 * Oligarchy) came from the portfolio and are not in the tasks app yet.
 */
export const BUILTIN_THEMES: PaletteTheme[] = [
  {
    name: "tokyo-night",
    label: "Tokyo Night",
    toml: `mode = "dark"

accent = "#7aa2f7"
selection = "#292e42"
muted = "#414868"

background = "#1a1b26"
dark_background = "#13141c"
darker_background = "#0e0e14"
lighter_background = "#24283b"

foreground = "#a9b1d6"
dark_foreground = "#565f89"
light_foreground = "#b4bee6"
bright_foreground = "#c0caf5"

red = "#f7768e"
yellow = "#e0af68"
orange = "#eb927b"
green = "#9ece6a"
cyan = "#449dab"
blue = "#7aa2f7"
magenta = "#ad8ee6"
brown = "#75493d"`,
  },
  {
    name: "catppuccin",
    label: "Catppuccin Mocha",
    toml: `mode = "dark"

accent = "#89b4fa"
selection = "#45475a"
muted = "#585b70"

background = "#1e1e2e"
dark_background = "#161622"
darker_background = "#101019"
lighter_background = "#313244"

foreground = "#cdd6f4"
dark_foreground = "#6c7086"
light_foreground = "#bac2de"
bright_foreground = "#cdd6f4"

red = "#f38ba8"
yellow = "#f9e2af"
orange = "#f6b6ab"
green = "#a6e3a1"
cyan = "#94e2d5"
blue = "#89b4fa"
magenta = "#f5c2e7"
brown = "#7b5b55"`,
  },
  {
    name: "gruvbox",
    label: "Gruvbox",
    toml: `mode = "dark"

accent = "#7daea3"
selection = "#504945"
muted = "#665c54"

background = "#282828"
dark_background = "#1e1e1e"
darker_background = "#161616"
lighter_background = "#3c3836"

foreground = "#d4be98"
dark_foreground = "#7c6f64"
light_foreground = "#bdae93"
bright_foreground = "#d4be98"

red = "#ea6962"
yellow = "#d8a657"
orange = "#e1875c"
green = "#a9b665"
cyan = "#89b482"
blue = "#7daea3"
magenta = "#d3869b"
brown = "#70432e"`,
  },
  {
    name: "nord",
    label: "Nord",
    toml: `mode = "dark"

accent = "#81a1c1"
selection = "#434c5e"
muted = "#4c566a"

background = "#2e3440"
dark_background = "#222730"
darker_background = "#191c23"
lighter_background = "#3b4252"

foreground = "#d8dee9"
dark_foreground = "#667080"
light_foreground = "#adb5c4"
bright_foreground = "#d8dee9"

red = "#bf616a"
yellow = "#ebcb8b"
orange = "#d5967a"
green = "#a3be8c"
cyan = "#88c0d0"
blue = "#81a1c1"
magenta = "#b48ead"
brown = "#6a4b3d"`,
  },
  {
    name: "catppuccin-latte",
    label: "Catppuccin Latte",
    toml: `mode = "light"

accent = "#1e66f5"
selection = "#ccd0da"
muted = "#acb0be"

background = "#eff1f5"
dark_background = "#e3e4e8"
darker_background = "#d7d8dc"
lighter_background = "#dce0e8"

foreground = "#4c4f69"
dark_foreground = "#9ca0b0"
light_foreground = "#5c5f77"
bright_foreground = "#4c4f69"

red = "#d20f39"
yellow = "#df8e1d"
orange = "#d84e2b"
green = "#40a02b"
cyan = "#179299"
blue = "#1e66f5"
magenta = "#ea76cb"
brown = "#6c2715"`,
  },
  {
    name: "rose-pine",
    label: "Rose Pine Dawn",
    toml: `mode = "light"

accent = "#56949f"
selection = "#dfdad9"
muted = "#cecacd"

background = "#faf4ed"
dark_background = "#ede7e1"
darker_background = "#e1dbd5"
lighter_background = "#f2e9e1"

foreground = "#575279"
dark_foreground = "#9893a5"
light_foreground = "#6e6a86"
bright_foreground = "#575279"

red = "#b4637a"
yellow = "#ea9d34"
orange = "#cf8057"
green = "#286983"
cyan = "#d7827e"
blue = "#56949f"
magenta = "#907aa9"
brown = "#67402b"`,
  },
  {
    name: "matte-black",
    label: "Matte Black",
    toml: `mode = "dark"

accent = "#e68e0d"
selection = "#333333"
muted = "#515151"

background = "#121212"
dark_background = "#0c0c0c"
darker_background = "#080808"
lighter_background = "#242424"

foreground = "#bebebe"
dark_foreground = "#8a8a8d"
light_foreground = "#d4d4d4"
bright_foreground = "#eaeaea"

red = "#d35f5f"
yellow = "#b91c1c"
orange = "#f59e0b"
green = "#ffc107"
cyan = "#bebebe"
blue = "#e68e0d"
magenta = "#d35f5f"
brown = "#5c4a38"`,
  },
  {
    name: "gilt",
    label: "Gilt",
    toml: `mode = "dark"

accent = "#D4AF37"
selection = "#342D1B"
muted = "#716957"

background = "#0D0F12"
dark_background = "#090A0C"
darker_background = "#050607"
lighter_background = "#181B20"

foreground = "#D8D1C0"
dark_foreground = "#7B7465"
light_foreground = "#E6DECB"
bright_foreground = "#F5EBD2"

red = "#BC6060"
yellow = "#D4AF37"
orange = "#C27B48"
green = "#7FA37A"
cyan = "#72A5A4"
blue = "#6F8FAF"
magenta = "#9A7AA0"
brown = "#8A6240"`,
  },
  {
    name: "ethereal",
    label: "Ethereal",
    toml: `mode = "dark"

accent = "#7d82d9"
selection = "#252e56"
muted = "#6d7db6"

background = "#060B1E"
dark_background = "#040816"
darker_background = "#030610"
lighter_background = "#131a3a"

foreground = "#ffcead"
dark_foreground = "#6d7db6"
light_foreground = "#c9b8a6"
bright_foreground = "#ffcead"

red = "#ED5B5A"
yellow = "#E9BB4F"
orange = "#eb8b54"
green = "#92a593"
cyan = "#a3bfd1"
blue = "#7d82d9"
magenta = "#c89dc1"
brown = "#75452a"`,
  },
  {
    name: "everforest",
    label: "Everforest",
    toml: `mode = "dark"

accent = "#7fbbb3"
selection = "#3d484d"
muted = "#475258"

background = "#2d353b"
dark_background = "#21272c"
darker_background = "#181d20"
lighter_background = "#343f44"

foreground = "#d3c6aa"
dark_foreground = "#4f585e"
light_foreground = "#9da9a0"
bright_foreground = "#d3c6aa"

red = "#e67e80"
yellow = "#dbbc7f"
orange = "#e09d7f"
green = "#a7c080"
cyan = "#83c092"
blue = "#7fbbb3"
magenta = "#d699b6"
brown = "#704e3f"`,
  },
  {
    name: "flexoki-light",
    label: "Flexoki Light",
    toml: `mode = "light"

accent = "#205EA6"
selection = "#CECDC3"
muted = "#B7B5AC"

background = "#FFFCF0"
dark_background = "#f2efe4"
darker_background = "#e5e2d8"
lighter_background = "#E6E4D9"

foreground = "#100F0F"
dark_foreground = "#878580"
light_foreground = "#403E3C"
bright_foreground = "#100F0F"

red = "#D14D41"
yellow = "#D0A215"
orange = "#d0772b"
green = "#879A39"
cyan = "#3AA99F"
blue = "#205EA6"
magenta = "#CE5D97"
brown = "#683b15"`,
  },
  {
    name: "hackerman",
    label: "Hackerman",
    toml: `mode = "dark"

accent = "#82FB9C"
selection = "#1f253a"
muted = "#2d3450"

background = "#0B0C16"
dark_background = "#080910"
darker_background = "#06060c"
lighter_background = "#151828"

foreground = "#ddf7ff"
dark_foreground = "#6a6e95"
light_foreground = "#b5c5db"
bright_foreground = "#ddf7ff"

red = "#50f872"
yellow = "#50f7d4"
orange = "#50f7a3"
green = "#4fe88f"
cyan = "#7cf8f7"
blue = "#829dd4"
magenta = "#86a7df"
brown = "#287b51"`,
  },
  {
    name: "kanagawa",
    label: "Kanagawa",
    toml: `mode = "dark"

accent = "#dcd7ba"
selection = "#363646"
muted = "#54546D"

background = "#1f1f28"
dark_background = "#17171e"
darker_background = "#111116"
lighter_background = "#223249"

foreground = "#dcd7ba"
dark_foreground = "#727169"
light_foreground = "#c8c093"
bright_foreground = "#dcd7ba"

red = "#c34043"
yellow = "#c0a36e"
orange = "#c17158"
green = "#76946a"
cyan = "#6a9589"
blue = "#7e9cd8"
magenta = "#957fb8"
brown = "#60382c"`,
  },
  {
    name: "last-horizon",
    label: "Last Horizon",
    toml: `mode = "dark"

accent = "#b59790"
selection = "#584e51"
muted = "#584e51"

background = "#0c0b0c"
dark_background = "#090809"
darker_background = "#060606"
lighter_background = "#0c0b0c"

foreground = "#FAFCFB"
dark_foreground = "#584e51"
light_foreground = "#cfd3cd"
bright_foreground = "#e2dddc"

red = "#c38b7b"
yellow = "#6B5E73"
green = "#87a9b0"
cyan = "#a5a0b6"
blue = "#b59790"
magenta = "#c4d8e2"`,
  },
  {
    name: "lumon",
    label: "Lumon",
    toml: `mode = "dark"

accent = "#8bc9eb"
selection = "#243d56"
muted = "#304860"

background = "#16242d"
dark_background = "#101b21"
darker_background = "#0b1216"
lighter_background = "#1b2d40"

foreground = "#d6e2ee"
dark_foreground = "#4d86b0"
light_foreground = "#d6e2ee"
bright_foreground = "#f2fcff"

red = "#4d86b0"
yellow = "#6fa4c9"
orange = "#8bc9eb"
green = "#5e95bc"
cyan = "#b4e4f6"
blue = "#6fb8e3"
magenta = "#8bc9eb"
brown = "#456475"`,
  },
  {
    name: "lupine",
    label: "Lupine",
    toml: `mode = "light"

accent = "#3264eb"
selection = "#d0d0d0"
muted = "#9e9e9e"

background = "#fafafa"
dark_background = "#ececec"
darker_background = "#dedede"
lighter_background = "#f5f5f5"

foreground = "#212121"
dark_foreground = "#757575"
light_foreground = "#424242"
bright_foreground = "#000000"

red = "#c900c4"
yellow = "#026fde"
orange = "#026fde"
green = "#4a2fd0"
cyan = "#0c67de"
blue = "#3264eb"
magenta = "#8a4ad7"
brown = "#013a6f"`,
  },
  {
    name: "miasma",
    label: "Miasma",
    toml: `mode = "dark"

accent = "#78824b"
selection = "#383838"
muted = "#666666"

background = "#222222"
dark_background = "#191919"
darker_background = "#121212"
lighter_background = "#2c2c2c"

foreground = "#c2c2b0"
dark_foreground = "#555555"
light_foreground = "#8a8a7e"
bright_foreground = "#c2c2b0"

red = "#685742"
yellow = "#b36d43"
orange = "#8d6242"
green = "#5f875f"
cyan = "#c9a554"
blue = "#78824b"
magenta = "#bb7744"
brown = "#463121"`,
  },
  {
    name: "osaka-jade",
    label: "Osaka Jade",
    toml: `mode = "dark"

accent = "#509475"
selection = "#32473B"
muted = "#53685B"

background = "#111c18"
dark_background = "#0c1512"
darker_background = "#090f0d"
lighter_background = "#23372B"

foreground = "#C1C497"
dark_foreground = "#81B8A8"
light_foreground = "#D6D5BC"
bright_foreground = "#F7E8B2"

red = "#FF5345"
yellow = "#459451"
orange = "#a2734b"
green = "#549e6a"
cyan = "#2DD5B7"
blue = "#509475"
magenta = "#D2689C"
brown = "#513925"`,
  },
  {
    name: "retro-82",
    label: "Retro 82",
    toml: `mode = "dark"

accent = "#faa968"
selection = "#134e5a"
muted = "#2a6b78"

background = "#05182e"
dark_background = "#031222"
darker_background = "#020c17"
lighter_background = "#0a2540"

foreground = "#f6dcac"
dark_foreground = "#3f8f8a"
light_foreground = "#a7c9c6"
bright_foreground = "#f6dcac"

red = "#f85525"
yellow = "#e97b3c"
orange = "#faa968"
green = "#028391"
cyan = "#8cbfb8"
blue = "#3f8f8a"
magenta = "#3f8f8a"
brown = "#743d1e"`,
  },
  {
    name: "ristretto",
    label: "Ristretto",
    toml: `mode = "dark"

accent = "#f38d70"
selection = "#403e41"
muted = "#72696a"

background = "#2c2525"
dark_background = "#211b1b"
darker_background = "#181414"
lighter_background = "#3d2f2a"

foreground = "#e6d9db"
dark_foreground = "#72696a"
light_foreground = "#c3b7b8"
bright_foreground = "#e6d9db"

red = "#fd6883"
yellow = "#f9cc6c"
orange = "#fb9a77"
green = "#adda78"
cyan = "#85dacc"
blue = "#f38d70"
magenta = "#a8a9eb"
brown = "#7d4d3b"`,
  },
  {
    name: "solitude",
    label: "Solitude",
    toml: `mode = "dark"

accent = "#798186"
selection = "#343d41"
muted = "#4b4e55"

background = "#101315"
dark_background = "#0c0e10"
darker_background = "#080a0b"
lighter_background = "#101315"

foreground = "#cacccc"
dark_foreground = "#4b4e55"
light_foreground = "#cbc2be"
bright_foreground = "#a5aeb4"

red = "#565d60"
yellow = "#d9dbdc"
green = "#9fa5a9"
cyan = "#707070"
blue = "#798186"
magenta = "#aeaeae"`,
  },
  {
    name: "vantablack",
    label: "Vantablack",
    toml: `mode = "dark"

accent = "#8d8d8d"
selection = "#1a1a1a"
muted = "#7a7a7a"

background = "#000000"
dark_background = "#090909"
darker_background = "#070707"
lighter_background = "#1a1a1a"

foreground = "#ffffff"
dark_foreground = "#505050"
light_foreground = "#ececec"
bright_foreground = "#ffffff"

red = "#a4a4a4"
yellow = "#cecece"
orange = "#b9b9b9"
green = "#b6b6b6"
cyan = "#b0b0b0"
blue = "#8d8d8d"
magenta = "#9b9b9b"
brown = "#5c5c5c"`,
  },
  {
    name: "white",
    label: "White",
    toml: `mode = "light"

accent = "#6e6e6e"
selection = "#c0c0c0"
muted = "#808080"

background = "#ffffff"
dark_background = "#f5f5f5"
darker_background = "#e8e8e8"
lighter_background = "#c0c0c0"

foreground = "#000000"
dark_foreground = "#c0c0c0"
light_foreground = "#000000"
bright_foreground = "#000000"

red = "#2a2a2a"
yellow = "#4a4a4a"
green = "#3a3a3a"
cyan = "#3e3e3e"
blue = "#1a1a1a"
magenta = "#2e2e2e"`,
  },
  /**
   * Copper Night, an Omarchy 4 theme by hembramnishant50-glitch.
   * Source: https://github.com/hembramnishant50-glitch/omarchy-coppernight-theme at commit
   * b1d0f8cbcc71c3ccd97057fddbb52d979efa7add.
   *
   * Upstream's README claims MIT, but the referenced LICENSE file is absent at that revision, so no
   * license notice is invented here.
   *
   * The upstream colors.toml is embedded unchanged. Its named slots map directly to the kit's
   * palette slots, including `mode`, `selection`, `orange`, and `brown`, so no compatibility overrides
   * are appended. The parser derives only the contrast-aware slots that are not present upstream
   * (`on_accent`, `on_red`, and `muted_foreground`). Terminal/UI extras that the kit does not expose
   * (`cursor`, `bright_*`, and `hyprland_*`) are parsed but ignored by the generated CSS.
   */
  {
    name: "coppernight",
    label: "Copper Night",
    toml: `mode = "dark"

accent = "#fab387"
cursor = "#ed8796"
selection = "#313244"
muted = "#5b6078"

background = "#11111b"
dark_background = "#0b0b12"
darker_background = "#060609"
lighter_background = "#1e1e2e"

foreground = "#cad3f5"
dark_foreground = "#6e738d"
light_foreground = "#b8c0e0"
bright_foreground = "#cad3f5"

red = "#ed8796"
yellow = "#eed49f"
orange = "#fab387"
green = "#a6da95"
cyan = "#8bd5ca"
blue = "#8aadf4"
magenta = "#c6a0f6"
brown = "#7b5b55"

bright_red = "#ed8796"
bright_yellow = "#fab387"
bright_green = "#a6da95"
bright_cyan = "#8bd5ca"
bright_blue = "#8aadf4"
bright_magenta = "#c6a0f6"

hyprland_active_border = "#fab387"
hyprland_inactive_border = "#c6a0f6"`,
  },
  {
    // The four greens of the BGB emulator's Game Boy palette: the page is the screen, cards are the pale
    // text boxes. Hues use only the two dark shades and their midpoint, since anything in the page's own
    // green would vanish on it; borders and hovers are midpoints between neighbouring shades.
    // Hidden from the picker; an app unlocks it (the portfolio uses the Konami code).
    name: "game-boy",
    label: "Game Boy",
    hidden: true,
    toml: `mode = "light"

accent = "#346856"
selection = "#b4dca0"
muted = "#5e9463"

background = "#e0f8d0"
dark_background = "#88c070"
lighter_background = "#b4dca0"

foreground = "#081820"
dark_foreground = "#346856"
bright_foreground = "#081820"

red = "#081820"
yellow = "#1e403b"
orange = "#346856"
green = "#346856"
cyan = "#1e403b"
blue = "#081820"
magenta = "#346856"
brown = "#1e403b"`,
  },
  /**
   * Oligarchy, a propaganda-poster light theme for Omarchy by AlexanderBuzz.
   * Source: https://github.com/AlexanderBuzz/omarchy-oligarchy-theme at commit
   * 6746fb318f5682cc1896957cb941ee2125dbff75, MIT licensed (notice in oligarchy.LICENSE, next to this file).
   *
   * This is an adaptation, not verbatim: upstream's colors.toml is kept unchanged at the top, and a
   * compatibility block is appended after it. Upstream only declares ANSI `colorN` keys, which the palette
   * parser ignores, so the block maps them onto the named hue slots the kit uses:
   * red=color1, green=color2, yellow=color3, blue=color4, magenta=color5, cyan=color6, orange=color11,
   * brown=color8, plus `mode = "light"` (otherwise inferred from the background).
   *
   * Upstream's selection (cream text on red) is deliberately not mapped to `selection`: the kit uses
   * that slot as a quiet surface under dark `bright_foreground` text, which red would make unreadable.
   * `selection` stays derived from background and foreground; `selection_*` are ignored.
   */
  {
    name: "oligarchy",
    label: "Oligarchy",
    toml: `# Oligarchy — a propaganda-poster LIGHT theme for Omarchy
# Palette extracted from the "Beware the Omarchy Oligarchy" poster:
# cream paper, brick red, ink black, with aged ochre/olive/slate secondaries.
# Selection mimics the poster's red banners (cream text on red).
#
# ANSI "white" (7 and 15) is inked rather than pale: on cream paper a literal
# white is invisible. Omarchy's own light themes invert it the same way, and
# newer Omarchy force-sets color7 to \`foreground\` regardless.

accent = "#c0271c"
cursor = "#c0271c"
foreground = "#1a160f"
background = "#eae0cb"
selection_foreground = "#eae0cb"
selection_background = "#c0271c"

color0  = "#1a160f"
color1  = "#b0281e"
color2  = "#5e6b33"
color3  = "#a9791f"
color4  = "#3e5a78"
color5  = "#7e3b4e"
color6  = "#2e6e6a"
color7  = "#3b342a"
color8  = "#6b6152"
color9  = "#c0271c"
color10 = "#77863f"
color11 = "#c99a3a"
color12 = "#4e7095"
color13 = "#9a5266"
color14 = "#3e8a84"
color15 = "#1a160f"

# --- Site compatibility mapping (not part of upstream) ---
# Maps upstream's ANSI colors onto the named slots the kit reads. \`selection\` is intentionally
# left out so it stays derived (see the comment above OLIGARCHY_THEME).
mode = "light"

red = "#b0281e"
green = "#5e6b33"
yellow = "#a9791f"
blue = "#3e5a78"
magenta = "#7e3b4e"
cyan = "#2e6e6a"
orange = "#c99a3a"
brown = "#6b6152"`,
  },
];
