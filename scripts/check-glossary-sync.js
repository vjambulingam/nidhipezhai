const tamil = require("../_data/glossary.json");
const english = require("../_data/glossary-en.json");

const categories = {
  "முதலீடு & பங்குச்சந்தை": "Investing & stock markets",
  "சர்வதேச முதலீடு": "International investing",
  "கடன் & வங்கி": "Loans & banking",
  "காப்பீடு": "Insurance",
  "சொத்து & உயில்": "Property & wills"
};
const errors = [];
const englishById = new Map();
for (const item of english) {
  if (englishById.has(item.id)) errors.push(`Duplicate English ID: ${item.id}`);
  englishById.set(item.id, item);
}
const tamilIds = new Set();
for (const master of tamil) {
  if (tamilIds.has(master.id)) errors.push(`Duplicate Tamil ID: ${master.id}`);
  tamilIds.add(master.id);
  const translation = englishById.get(master.id);
  if (!translation) {
    errors.push(`Missing English entry: ${master.id}`);
    continue;
  }
  if (translation.term !== master.termEnglish) errors.push(`Term differs from master: ${master.id}`);
  if (!categories[master.category] || translation.category !== categories[master.category]) {
    errors.push(`Category differs from master: ${master.id}`);
  }
  for (const field of ["definition", "example"]) {
    if (typeof translation[field] !== "string" || !translation[field].trim()) {
      errors.push(`Missing ${field}: ${master.id}`);
    }
  }
  const link = translation.relatedLink;
  if (master.relatedLink) {
    if (!link || !["ta", "en"].includes(link.language) ||
        typeof link.title !== "string" || !link.title.trim() ||
        link.url !== (link.language === "en" ? `/en${master.relatedLink.url}` : master.relatedLink.url)) {
      errors.push(`Related link differs from master: ${master.id}`);
    }
  } else if (link) {
    errors.push(`Unexpected related link: ${master.id}`);
  }
}
for (const id of englishById.keys()) {
  if (!tamilIds.has(id)) errors.push(`English entry has no Tamil master: ${id}`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Glossaries match: ${tamil.length} entries.`);
}
