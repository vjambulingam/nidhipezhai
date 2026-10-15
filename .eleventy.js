const siteData = require("./_data/site.json");
const tamilDateFormatter = new Intl.DateTimeFormat("ta-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC"
});
const siteOrigin = process.env.SITE_ORIGIN || process.env.URL || (process.env.CUSTOM_DOMAIN ? `https://${process.env.CUSTOM_DOMAIN}` : siteData.url || "https://nidhipezhai.com");

function toDate(value) {
  return value instanceof Date ? value : new Date(value);
}

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

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.addGlobalData("layout", "layouts/base.njk");
  eleventyConfig.addGlobalData("siteOrigin", siteOrigin);

  eleventyConfig.addCollection("articlesByDate", (collectionApi) => {
    return collectionApi.getFilteredByTag("articles").sort((a, b) => {
      const timeB = toDate(b.date).getTime() || 0;
      const timeA = toDate(a.date).getTime() || 0;
      return timeB - timeA;
    });
  });

  eleventyConfig.addCollection("topics", (collectionApi) => {
    const topicSet = new Set();
    for (const item of collectionApi.getFilteredByTag("articles")) {
      const topics = normalizeList(item.data.topics);
      for (const topic of topics) {
        if (topic) topicSet.add(topic);
      }
    }
    return [...topicSet];
  });

  eleventyConfig.addCollection("seoPages", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter((item) => item.url && item.url !== "/404.html" && !item.data.eleventyExcludeFromCollections)
      .sort((a, b) => a.url.localeCompare(b.url));
  });

  eleventyConfig.addFilter("dateIso", (value) => toDate(value).toISOString().split("T")[0]);
  eleventyConfig.addFilter("dateTamil", (value) => tamilDateFormatter.format(toDate(value)));
  eleventyConfig.addFilter("jsonify", (value) => JSON.stringify(value).replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("absoluteUrl", (value) => {
    return siteOrigin ? new URL(value, siteOrigin).toString() : value;
  });
  eleventyConfig.addFilter("readingTime", (value) => {
    let raw = value;
    if (value && typeof value === "object") {
      raw = value.templateContent || value.rawInput || value.content || "";
    }
    const text = String(raw || "").replace(/<[^>]*>/g, " ").trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  });

  eleventyConfig.addFilter("normalizeList", normalizeList);

  eleventyConfig.addFilter("articleDataTopics", (article) => {
    const topics = normalizeList(article?.data?.topics);
    const keywords = normalizeList(article?.data?.keywords);
    return Array.from(new Set([...topics, ...keywords])).join("|");
  });

  eleventyConfig.addFilter("articleTopicsString", (article, delimiter = " · ") => {
    const topics = normalizeList(article?.data?.topics);
    return topics.join(delimiter);
  });

  eleventyConfig.addFilter("articleSearchText", (article) => {
    const title = article?.data?.title || "";
    const description = article?.data?.description || "";
    const topics = normalizeList(article?.data?.topics);
    const keywords = normalizeList(article?.data?.keywords);
    return [title, description, ...topics, ...keywords].join(" ");
  });
};