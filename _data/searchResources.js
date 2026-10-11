const fs = require("node:fs");
const path = require("node:path");
const calculatorGroups = require("./calculators.json");
const checklistGroups = require("./checklists.json");

function getAttribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2];
}

function readKeywords(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  const keywordTag = metaTags.find((tag) => getAttribute(tag, "name")?.toLowerCase() === "keywords");
  const content = keywordTag ? getAttribute(keywordTag, "content") || "" : "";

  return content
    .replace(/&amp;/gi, "&")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function collectResources(groups, sourceDirectory, resourceType, resourceLabel) {
  return groups.flatMap((group) => group.items.map((item) => {
    const pathname = new URL(item.url, "https://nidhipezhai.invalid").pathname;
    const filename = path.basename(pathname);
    const filePath = path.join(__dirname, "..", sourceDirectory, filename);
    const keywords = readKeywords(filePath);

    return {
      ...item,
      resourceType,
      searchText: [
        resourceLabel,
        group.category,
        item.title,
        item.type,
        item.description,
        path.basename(filename, path.extname(filename)),
        ...keywords
      ].join(" ")
    };
  }));
}

module.exports = {
  calculators: collectResources(calculatorGroups, "_calculators", "calculator", "கணிப்பேடு"),
  checklists: collectResources(checklistGroups, "_checklists", "checklist", "சரிபார்ப்புப் பட்டியல்")
};
