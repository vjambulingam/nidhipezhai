// Generates a 1200x630 Open Graph PNG for every calculator in _data/calculators.json.
// Runs on any OS: @napi-rs/canvas (Skia + HarfBuzz) shapes Tamil text using the bundled Noto Sans Tamil font.
// Output: assets/images/og/calculators/<slug>.png (git-ignored; regenerated on every build).
const fs = require("fs");
const path = require("path");
const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");

const root = path.join(__dirname, "..");
const outDir = path.join(root, "assets/images/og/calculators");
const fontDir = path.join(root, "node_modules/@expo-google-fonts/noto-sans-tamil");
GlobalFonts.registerFromPath(path.join(fontDir, "400Regular/NotoSansTamil_400Regular.ttf"), "NidhiTamil");
GlobalFonts.registerFromPath(path.join(fontDir, "700Bold/NotoSansTamil_700Bold.ttf"), "NidhiTamilBold");
const groups = JSON.parse(fs.readFileSync(path.join(root, "_data/calculators.json"), "utf8"));

const TEAL = "#0D7377";
const TEAL_DARK = "#063F42";
const GOLD = "#E8B94A";
const W = 1200;
const H = 630;

const regular = (size) => `${size}px NidhiTamil`;
const bold = (size) => `${size}px NidhiTamilBold`;

function wrap(ctx, text, maxWidth) {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function render({ title, type, category }) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "alphabetic";

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, TEAL);
  grad.addColorStop(1, TEAL_DARK);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(232,185,74,0.16)";
  [[300, 3], [220, 2], [140, 2]].forEach(([r, w]) => {
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.arc(1080, 550, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.fillStyle = GOLD;
  ctx.fillRect(0, 0, 14, H);

  ctx.fillStyle = "#fff";
  ctx.font = bold(46);
  ctx.fillText("நிதிப்பேழை", 80, 95);
  ctx.fillStyle = GOLD;
  ctx.font = regular(22);
  ctx.fillText("நிதி நலம் காக்கத் தெளிவான நிதி அறிவு", 80, 135);

  ctx.font = bold(22);
  const pillW = Math.min(1040, ctx.measureText(category).width + 40);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(80, 254, pillW, 46, 23);
  ctx.stroke();
  ctx.fillText(category, 100, 285);

  // Largest title size that fits in two lines
  let size = 72;
  let lines;
  for (; size >= 36; size -= 2) {
    ctx.font = bold(size);
    lines = wrap(ctx, title, 1040);
    if (lines.length <= 2) break;
  }
  const lineH = Math.round(size * 1.35);
  ctx.fillStyle = "#fff";
  lines.forEach((l, i) => ctx.fillText(l, 80, 470 - (lines.length - 1 - i) * lineH));

  ctx.fillStyle = GOLD;
  ctx.font = regular(26);
  ctx.fillText(`${type} · கணிப்பேடு`, 80, 582);
  ctx.fillStyle = "#fff";
  ctx.font = bold(26);
  ctx.textAlign = "right";
  ctx.fillText("nidhipezhai.com", 1120, 582);

  return canvas.toBuffer("image/png");
}

fs.mkdirSync(outDir, { recursive: true });
let count = 0;
for (const group of groups) {
  for (const item of group.items) {
    const slug = path.basename(item.url, ".html");
    fs.writeFileSync(path.join(outDir, `${slug}.png`), render({ title: item.title, type: item.type, category: group.category }));
    count += 1;
  }
}
console.log(`Generated ${count} calculator Open Graph images in ${path.relative(root, outDir)}`);
