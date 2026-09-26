const tamilDateFormatter = new Intl.DateTimeFormat("ta-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC"
});
const siteOrigin = process.env.SITE_ORIGIN || process.env.URL || "";

function toDate(value) {
  return value instanceof Date ? value : new Date(value);
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({ "_calculators": "calculators" });
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("_calculators/**");
  eleventyConfig.addGlobalData("layout", "layouts/base.njk");
  eleventyConfig.addGlobalData("siteOrigin", siteOrigin);
  eleventyConfig.addFilter("dateIso", (value) => toDate(value).toISOString().split("T")[0]);
  eleventyConfig.addFilter("dateTamil", (value) => tamilDateFormatter.format(toDate(value)));
  eleventyConfig.addFilter("absoluteUrl", (value) => {
    return siteOrigin ? new URL(value, siteOrigin).toString() : value;
  });
  eleventyConfig.addFilter("readingTime", (value) => {
    const text = String(value || "").replace(/<[^>]*>/g, " ").trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    return Math.max(1, Math.ceil(wordCount / 200));
  });
};