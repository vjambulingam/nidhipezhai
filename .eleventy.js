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

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.addGlobalData("layout", "layouts/base.njk");
  eleventyConfig.addGlobalData("siteOrigin", siteOrigin);
  eleventyConfig.addCollection("articlesByDate", (collectionApi) => {
    return collectionApi.getFilteredByTag("articles").sort((a, b) => b.date.getTime() - a.date.getTime());
  });
  eleventyConfig.addCollection("topics", (collectionApi) => {
    const topicSet = new Set();
    for (const item of collectionApi.getFilteredByTag("articles")) {
      for (const topic of item.data.topics || []) {
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
    const text = String(value || "").replace(/<[^>]*>/g, " ").trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  });
};