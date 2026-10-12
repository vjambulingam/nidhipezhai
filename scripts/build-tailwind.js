const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SCAN_DIRS = ["_calculators", "_checklists", "_includes/layouts"];
const OUTPUT_CSS = path.join(ROOT, "assets", "css", "tailwind.css");

const COLORS = {
  white: "#ffffff",
  slate: {
    50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 300: "#cbd5e1",
    400: "#94a3b8", 500: "#64748b", 600: "#475569", 700: "#334155",
    800: "#1e293b", 900: "#0f172a"
  },
  gray: {
    50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 300: "#d1d5db",
    400: "#9ca3af", 500: "#6b7280", 600: "#4b5563", 700: "#374151",
    800: "#1f2937", 900: "#111827"
  },
  amber: {
    50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 500: "#f59e0b",
    600: "#d97706", 700: "#b45309", 900: "#78350f"
  },
  emerald: {
    50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 500: "#10b981",
    600: "#059669", 700: "#047857", 800: "#065f46", 900: "#064e3b",
    950: "#022c22"
  },
  teal: {
    50: "#f0fdfa", 500: "#14b8a6", 600: "#0d9488", 700: "#0f766e", 800: "#115e59"
  },
  sky: {
    50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc",
    500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1", 800: "#075985", 900: "#0c4a6e"
  },
  indigo: {
    50: "#eef2ff", 100: "#e0e7ff", 500: "#6366f1", 600: "#4f46e5",
    700: "#4338ca", 800: "#3730a3", 900: "#312e81", 950: "#1e1b4b"
  },
  rose: {
    400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c"
  },
  red: {
    50: "#fef2f2", 200: "#fecaca", 800: "#991b1b"
  }
};

const SPACING = {
  "0": "0px", "px": "1px", "0.5": "0.125rem", "1": "0.25rem", "1.5": "0.375rem",
  "2": "0.5rem", "2.5": "0.625rem", "3": "0.75rem", "3.5": "0.875rem",
  "4": "1rem", "5": "1.25rem", "6": "1.5rem", "7": "1.75rem", "8": "2rem",
  "9": "2.25rem", "10": "2.5rem", "11": "2.75rem", "12": "3rem", "16": "4rem",
  "20": "5rem", "24": "6rem", "28": "7rem", "32": "8rem", "36": "9rem",
  "40": "10rem", "44": "11rem", "48": "12rem", "56": "14rem", "72": "18rem",
  "80": "20rem"
};

function hexToRgba(hex, alphaPercent) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const a = Number(alphaPercent) / 100;
  return `rgb(${r} ${g} ${b} / ${a})`;
}

function resolveColor(token) {
  const [base, alpha] = token.split("/");
  let hex = null;
  if (base === "white") {
    hex = COLORS.white;
  } else {
    const parts = base.split("-");
    if (parts.length === 2 && COLORS[parts[0]] && COLORS[parts[0]][parts[1]]) {
      hex = COLORS[parts[0]][parts[1]];
    }
  }
  if (!hex) return null;
  return alpha ? hexToRgba(hex, alpha) : hex;
}

function escapeSelector(cls) {
  return "." + cls.replace(/([^a-zA-Z0-9_-])/g, "\\$1");
}

function compileBaseRule(core) {
  // Layout & display
  const exactMap = {
    "block": "display:block",
    "inline-block": "display:inline-block",
    "flex": "display:flex",
    "inline-flex": "display:inline-flex",
    "grid": "display:grid",
    "hidden": "display:none",
    "relative": "position:relative",
    "absolute": "position:absolute",
    "sticky": "position:sticky",
    "inset-0": "inset:0px",
    "inset-y-0": "top:0px;bottom:0px",
    "top-0": "top:0px",
    "top-20": "top:5rem",
    "left-0": "left:0px",
    "right-0": "right:0px",
    "-bottom-6": "bottom:-1.5rem",
    "-bottom-8": "bottom:-2rem",
    "-right-6": "right:-1.5rem",
    "-right-8": "right:-2rem",
    "z-40": "z-index:40",
    "z-50": "z-index:50",
    "flex-1": "flex:1 1 0%",
    "flex-grow": "flex-grow:1",
    "shrink-0": "flex-shrink:0",
    "flex-col": "flex-direction:column",
    "flex-row": "flex-direction:row",
    "flex-wrap": "flex-wrap:wrap",
    "items-start": "align-items:flex-start",
    "items-center": "align-items:center",
    "items-baseline": "align-items:baseline",
    "justify-center": "justify-content:center",
    "justify-between": "justify-content:space-between",
    "w-full": "width:100%",
    "h-full": "height:100%",
    "min-w-0": "min-width:0px",
    "min-w-[520px]": "min-width:520px",
    "min-w-[560px]": "min-width:560px",
    "min-w-[620px]": "min-width:620px",
    "max-w-3xl": "max-width:48rem",
    "max-w-6xl": "max-width:72rem",
    "max-w-7xl": "max-width:80rem",
    "max-w-full": "max-width:100%",
    "min-h-screen": "min-height:100vh",
    "mx-auto": "margin-left:auto;margin-right:auto",
    "overflow-hidden": "overflow:hidden",
    "overflow-x-auto": "overflow-x:auto",
    "border-collapse": "border-collapse:collapse",
    "border": "border-width:1px",
    "border-2": "border-width:2px",
    "border-t": "border-top-width:1px",
    "border-t-2": "border-top-width:2px",
    "border-b": "border-bottom-width:1px",
    "border-l-4": "border-left-width:4px",
    "border-r-0": "border-right-width:0px",
    "border-dashed": "border-style:dashed",
    "rounded-xs": "border-radius:0.125rem",
    "rounded-sm": "border-radius:0.125rem",
    "rounded": "border-radius:0.25rem",
    "rounded-md": "border-radius:0.375rem",
    "rounded-lg": "border-radius:0.5rem",
    "rounded-xl": "border-radius:0.75rem",
    "rounded-2xl": "border-radius:1rem",
    "rounded-full": "border-radius:9999px",
    "rounded-l-lg": "border-top-left-radius:0.5rem;border-bottom-left-radius:0.5rem",
    "rounded-r-lg": "border-top-right-radius:0.5rem;border-bottom-right-radius:0.5rem",
    "rounded-r-none": "border-top-right-radius:0px;border-bottom-right-radius:0px",
    "shadow-xs": "box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "shadow-sm": "box-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    "shadow-md": "box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "shadow-lg": "box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "outline-none": "outline:2px solid transparent;outline-offset:2px",
    "ring-2": "box-shadow:0 0 0 2px var(--tw-ring-color, rgb(14 165 233 / 0.5))",
    "ring-sky-500": "--tw-ring-color:rgb(14 165 233 / 0.5)",
    "ring-emerald-500": "--tw-ring-color:rgb(16 185 129 / 0.5)",
    "font-normal": "font-weight:400",
    "font-medium": "font-weight:500",
    "font-semibold": "font-weight:600",
    "font-bold": "font-weight:700",
    "font-extrabold": "font-weight:800",
    "text-[10px]": "font-size:10px",
    "text-[11px]": "font-size:11px",
    "text-xs": "font-size:0.75rem;line-height:1rem",
    "text-sm": "font-size:0.875rem;line-height:1.25rem",
    "text-base": "font-size:1rem;line-height:1.5rem",
    "text-lg": "font-size:1.125rem;line-height:1.75rem",
    "text-xl": "font-size:1.25rem;line-height:1.75rem",
    "text-2xl": "font-size:1.5rem;line-height:2rem",
    "text-3xl": "font-size:1.875rem;line-height:2.25rem",
    "text-4xl": "font-size:2.25rem;line-height:2.5rem",
    "leading-tight": "line-height:1.25",
    "leading-snug": "line-height:1.375",
    "leading-relaxed": "line-height:1.625",
    "tracking-tight": "letter-spacing:-0.025em",
    "tracking-wider": "letter-spacing:0.05em",
    "text-left": "text-align:left",
    "text-center": "text-align:center",
    "text-right": "text-align:right",
    "uppercase": "text-transform:uppercase",
    "underline": "text-decoration-line:underline",
    "underline-offset-2": "text-underline-offset:2px",
    "antialiased": "-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale",
    "break-words": "overflow-wrap:break-word",
    "opacity-40": "opacity:0.4",
    "opacity-50": "opacity:0.5",
    "opacity-80": "opacity:0.8",
    "opacity-90": "opacity:0.9",
    "blur-sm": "filter:blur(4px)",
    "backdrop-blur-xs": "backdrop-filter:blur(2px)",
    "backdrop-blur-md": "backdrop-filter:blur(12px)",
    "cursor-pointer": "cursor:pointer",
    "cursor-not-allowed": "cursor:not-allowed",
    "pointer-events-none": "pointer-events:none",
    "transform": "transform:translate(var(--tw-translate-x,0),var(--tw-translate-y,0)) rotate(var(--tw-rotate,0))",
    "rotate-90": "--tw-rotate:90deg;transform:rotate(90deg)",
    "translate-x-full": "--tw-translate-x:100%;transform:translateX(100%)",
    "transition": "transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms",
    "transition-all": "transition-property:all;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms",
    "transition-colors": "transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms",
    "transition-transform": "transition-property:transform;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms",
    "sr-only": "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0",
    "accent-emerald-600": "accent-color:#059669",
    "content-['']": "content:''",
    "top-[2px]": "top:2px",
    "left-[2px]": "left:2px",
    "bg-gradient-to-r": "background-image:linear-gradient(to right, var(--tw-gradient-stops))",
    "bg-gradient-to-br": "background-image:linear-gradient(to bottom right, var(--tw-gradient-stops))",
    "bg-gradient-to-tr": "background-image:linear-gradient(to top right, var(--tw-gradient-stops))",
    "grid-cols-1": "grid-template-columns:repeat(1,minmax(0,1fr))",
    "grid-cols-2": "grid-template-columns:repeat(2,minmax(0,1fr))",
    "grid-cols-3": "grid-template-columns:repeat(3,minmax(0,1fr))",
    "grid-cols-4": "grid-template-columns:repeat(4,minmax(0,1fr))",
    "grid-cols-5": "grid-template-columns:repeat(5,minmax(0,1fr))",
    "grid-cols-12": "grid-template-columns:repeat(12,minmax(0,1fr))",
    "grid-cols-[1fr_6rem_auto]": "grid-template-columns:1fr 6rem auto",
    "grid-cols-[1fr_8rem_auto]": "grid-template-columns:1fr 8rem auto",
    "col-span-2": "grid-column:span 2 / span 2",
    "col-span-3": "grid-column:span 3 / span 3",
    "col-span-5": "grid-column:span 5 / span 5",
    "col-span-7": "grid-column:span 7 / span 7"
  };

  if (exactMap[core]) return { decl: exactMap[core] };

  // Width / Height / Spacing
  let m;
  if ((m = core.match(/^w-(.+)$/))) {
    if (SPACING[m[1]]) return { decl: `width:${SPACING[m[1]]}` };
  }
  if ((m = core.match(/^h-(.+)$/))) {
    if (SPACING[m[1]]) return { decl: `height:${SPACING[m[1]]}` };
  }
  const spacingPrefixes = {
    "p": ["padding"],
    "px": ["padding-left", "padding-right"],
    "py": ["padding-top", "padding-bottom"],
    "pt": ["padding-top"],
    "pb": ["padding-bottom"],
    "pl": ["padding-left"],
    "pr": ["padding-right"],
    "m": ["margin"],
    "mx": ["margin-left", "margin-right"],
    "my": ["margin-top", "margin-bottom"],
    "mt": ["margin-top"],
    "mb": ["margin-bottom"],
    "ml": ["margin-left"],
    "mr": ["margin-right"],
    "gap": ["gap"],
    "gap-x": ["column-gap"],
    "gap-y": ["row-gap"]
  };
  for (const [prefix, props] of Object.entries(spacingPrefixes)) {
    if (core.startsWith(prefix + "-")) {
      const valKey = core.slice(prefix.length + 1);
      if (SPACING[valKey]) {
        return { decl: props.map((p) => `${p}:${SPACING[valKey]}`).join(";") };
      }
    }
  }

  // space-x / space-y / divide
  if ((m = core.match(/^space-x-(.+)$/)) && SPACING[m[1]]) {
    return { childSuffix: " > :not([hidden]) ~ :not([hidden])", decl: `margin-left:${SPACING[m[1]]}` };
  }
  if ((m = core.match(/^space-y-(.+)$/)) && SPACING[m[1]]) {
    return { childSuffix: " > :not([hidden]) ~ :not([hidden])", decl: `margin-top:${SPACING[m[1]]}` };
  }
  if (core === "divide-y") {
    return { childSuffix: " > :not([hidden]) ~ :not([hidden])", decl: "border-top-width:1px" };
  }
  if ((m = core.match(/^divide-(.+)$/))) {
    const c = resolveColor(m[1]);
    if (c) return { childSuffix: " > :not([hidden]) ~ :not([hidden])", decl: `border-color:${c}` };
  }

  // Colors: bg-*, text-*, border-*, from-*, via-*, to-*
  if (core.startsWith("bg-")) {
    const c = resolveColor(core.slice(3));
    if (c) return { decl: `background-color:${c}` };
  }
  if (core.startsWith("text-")) {
    const c = resolveColor(core.slice(5));
    if (c) return { decl: `color:${c}` };
  }
  if (core.startsWith("border-")) {
    const c = resolveColor(core.slice(7));
    if (c) return { decl: `border-color:${c}` };
  }
  if (core.startsWith("from-")) {
    const c = resolveColor(core.slice(5));
    if (c) return { decl: `--tw-gradient-from:${c};--tw-gradient-to:rgb(255 255 255 / 0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)` };
  }
  if (core.startsWith("via-")) {
    const c = resolveColor(core.slice(4));
    if (c) return { decl: `--tw-gradient-to:rgb(255 255 255 / 0);--tw-gradient-stops:var(--tw-gradient-from),${c},var(--tw-gradient-to)` };
  }
  if (core.startsWith("to-")) {
    const c = resolveColor(core.slice(3));
    if (c) return { decl: `--tw-gradient-to:${c}` };
  }

  return null;
}

const IGNORED_CUSTOM_CLASSES = new Set([
  "active", "brand", "brand__mark", "brand__name", "brand__tagline", "brand__text",
  "btn-remove-lump", "calc-nav-articles", "calc-nav-checklists", "calc-nav-directory",
  "calc-site-footer", "calc-site-footer__brand", "calc-site-footer__disclaimer",
  "calc-site-footer__inner", "calc-site-footer__license", "calc-site-footer__links",
  "calc-site-footer__main", "calc-site-footer__tagline", "calc-site-header__actions",
  "calc-site-header__identity", "calc-site-header__inner", "calc-site-header__nav",
  "calc-site-logo", "calculator-card", "calculator-card__open", "calculator-card__type",
  "calculator-grid", "calculator-group", "car-type-btn", "checklist-header__actions",
  "checklist-page", "checklist-site-header", "customer-type-btn", "group", "hospital-tab",
  "investor-type-btn", "lump-amt-input", "lump-month-input", "mode-btn", "no-print",
  "peer", "policy-option", "preset-amt", "preset-btn", "preset-rate", "print-border",
  "profile-tab-btn", "purpose-btn", "selected", "sip-mode-btn", "site-footer",
  "site-footer__brand", "site-footer__disclaimer", "site-footer__license",
  "site-footer__links", "site-footer__main", "site-header", "site-header__inner",
  "site-nav", "site-nav__articles", "site-nav__checklists", "site-nav__tool",
  "strategy-btn", "task-checkbox", "wrap"
]);

function extractClassesFromFile(filePath) {
  const txt = fs.readFileSync(filePath, "utf8");
  const tokens = new Set();

  const addSplit = (str) => {
    for (const raw of str.split(/\s+/)) {
      const cleaned = raw.replace(/^['"`]+|['"`}]+$/g, "").trim();
      if (!cleaned || cleaned.includes("${") || cleaned.includes("{{") || cleaned.includes("{%") || cleaned === "?" || cleaned === ":") continue;
      tokens.add(cleaned);
    }
  };

  for (const m of txt.matchAll(/class\s*=\s*"([^"]+)"/g)) {
    const noNjk = m[1].replace(/\{\{.*?\}\}|\{%.*?%\}/g, " ");
    for (const lit of noNjk.matchAll(/'([^']+)'/g)) addSplit(lit[1]);
    addSplit(noNjk.replace(/\$\{.*?\}/g, " "));
  }
  for (const m of txt.matchAll(/className\s*=\s*["'`]([^"'`]+)["'`]/g)) {
    for (const lit of m[1].matchAll(/'([^']+)'/g)) addSplit(lit[1]);
    addSplit(m[1].replace(/\$\{.*?\}/g, " "));
  }
  for (const m of txt.matchAll(/classList\.(?:add|remove|toggle)\(([^)]+)\)/g)) {
    for (const lit of m[1].matchAll(/["']([^"']+)["']/g)) addSplit(lit[1]);
  }
  return tokens;
}

const allTokens = new Set();
for (const dir of SCAN_DIRS) {
  const fullDir = path.join(ROOT, dir);
  for (const entry of fs.readdirSync(fullDir)) {
    if (entry.endsWith(".html") || entry.endsWith(".njk")) {
      for (const t of extractClassesFromFile(path.join(fullDir, entry))) {
        allTokens.add(t);
      }
    }
  }
}

const preflight = `/* Static Tailwind CSS bundle generated by scripts/build-tailwind.js */
*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:Inter,"Noto Sans Tamil",sans-serif}
body{margin:0;line-height:inherit}
hr{height:0;color:inherit;border-top-width:1px}
h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit;margin:0}
a{color:inherit;text-decoration:inherit}
b,strong{font-weight:bolder}
table{text-indent:0;border-color:inherit;border-collapse:collapse}
button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}
button,select{text-transform:none}
button,[type='button'],[type='reset'],[type='submit']{-webkit-appearance:button;background-color:transparent;background-image:none}
p,blockquote,dl,dd,ol,ul,figure,pre{margin:0}
ol,ul,menu{list-style:none;padding:0}
img,svg,video,canvas{display:block;vertical-align:middle}
img,video{max-width:100%;height:auto}
[hidden]{display:none!important}
`;

const baseRules = [];
const mediaRules = { sm: [], md: [], lg: [], xl: [] };
const unknown = [];

for (const token of [...allTokens].sort()) {
  if (IGNORED_CUSTOM_CLASSES.has(token) || token.startsWith("article") || token.startsWith("featured") || token.startsWith("hero") || token.startsWith("eyebrow") || token.startsWith("topic") || token.startsWith("search") || token.startsWith("section") || token.startsWith("simple") || token.startsWith("legal") || token.startsWith("directory") || token.startsWith("tools") || token.startsWith("breadcrumbs") || token.startsWith("visually") || token.startsWith("empty") || token.startsWith("results")) {
    continue;
  }

  let parts = token.split(":");
  const core = parts.pop();
  const variants = parts;

  const compiled = compileBaseRule(core);
  if (!compiled) {
    unknown.push(token);
    continue;
  }

  let selector = escapeSelector(token);
  let media = null;

  for (const v of variants) {
    if (v === "sm" || v === "md" || v === "lg" || v === "xl") {
      media = v;
    } else if (v === "hover") {
      selector += ":hover";
    } else if (v === "focus") {
      selector += ":focus";
    } else if (v === "disabled") {
      selector += ":disabled";
    } else if (v === "after") {
      selector += "::after";
    } else if (v === "group-hover") {
      selector = `.group:hover ${selector}`;
    } else if (v === "peer-checked") {
      selector = `.peer:checked ~ ${selector}`;
    } else if (v === "peer-focus") {
      selector = `.peer:focus ~ ${selector}`;
    }
  }

  if (compiled.childSuffix) {
    selector += compiled.childSuffix;
  }

  const rule = `${selector}{${compiled.decl}}`;
  if (media) {
    mediaRules[media].push(rule);
  } else {
    baseRules.push(rule);
  }
}

if (unknown.length > 0) {
  console.error("Unrecognized utility classes:", unknown);
  process.exit(1);
}

const breakpoints = { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" };
let css = preflight + "\n" + baseRules.join("\n") + "\n";
for (const [bp, rules] of Object.entries(mediaRules)) {
  if (rules.length) {
    css += `@media (min-width: ${breakpoints[bp]}){\n${rules.join("\n")}\n}\n`;
  }
}

fs.writeFileSync(OUTPUT_CSS, css, "utf8");
console.log(`Built ${path.relative(ROOT, OUTPUT_CSS)} (${(Buffer.byteLength(css) / 1024).toFixed(1)} KB, ${baseRules.length} base rules)`);
