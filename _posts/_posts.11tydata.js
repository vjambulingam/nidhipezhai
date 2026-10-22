function normalizeList(val) {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.flatMap((x) => {
      if (typeof x === "string" && x.includes(",")) {
        return x.split(",").map((s) => s.trim()).filter(Boolean);
      }
      return String(x).trim();
    }).filter(Boolean);
  }
  if (typeof val === "string") {
    return val.split(/[,\n]/).map((x) => x.trim().replace(/^-\s*/, "")).filter(Boolean);
  }
  return [];
}

module.exports = {
  tags: ["articles"],
  layout: "layouts/article.njk",
  eleventyComputed: {
    permalink: (data) => `/articles/${data.page.fileSlug}/index.html`,
    seoType: "article",
    topics: (data) => normalizeList(data.topics),
    keywords: (data) => normalizeList(data.keywords),
    lastModified: (data) => data.lastModified || data.date
  }
};