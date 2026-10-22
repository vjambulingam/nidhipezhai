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
      const timeB = toDate(b.data.lastModified || b.date).getTime() || 0;
      const timeA = toDate(a.data.lastModified || a.date).getTime() || 0;
      return timeB - timeA;
    });
  });

  const PRIMARY_TOPICS = [
    "சேமிப்பு",
    "முதலீடு",
    "பங்குச்சந்தை",
    "மியூச்சுவல் ஃபண்ட்",
    "கடன் & கிரெடிட்",
    "காப்பீடு & பாதுகாப்பு",
    "தங்கம் & சொத்துகள்"
  ];

  const TOPIC_MAPPING = {
    "சேமிப்பு": [
      "banking-and-savings-products-india",
      "chit-funds",
      "gold-chits-jeweller-gold-schemes",
      "how-to-start-investing",
      "in-case-of-emergency-kit",
      "personal-finance-fortification",
      "savings-and-debt-instruments-india"
    ],
    "முதலீடு": [
      "chit-funds",
      "cryptocurrency-and-nft-trading-india",
      "currency-and-commodity-trading-india",
      "equity-investments-in-india",
      "gold-investing-options-india",
      "hidden-risks-of-real-estate-investments-india",
      "how-to-start-investing",
      "index-funds-vs-active-mutual-funds",
      "investing-in-foreign-equity-from-india",
      "invit",
      "loan-prepayment-vs-equity-investment",
      "portfolio-creation-approach",
      "regular-vs-direct-mutual-funds",
      "reit",
      "savings-and-debt-instruments-india",
      "sebi-registered-investment-advisors"
    ],
    "பங்குச்சந்தை": [
      "currency-and-commodity-trading-india",
      "equity-investments-in-india",
      "index-funds-vs-active-mutual-funds",
      "investing-in-foreign-equity-from-india",
      "invit",
      "loan-prepayment-vs-equity-investment",
      "reit"
    ],
    "மியூச்சுவல் ஃபண்ட்": [
      "equity-investments-in-india",
      "index-funds-vs-active-mutual-funds",
      "loan-prepayment-vs-equity-investment",
      "regular-vs-direct-mutual-funds"
    ],
    "கடன் & கிரெடிட்": [
      "chit-funds",
      "credit-card-optimization-and-traps",
      "credit-score",
      "lending-products-india",
      "loan-prepayment-vs-equity-investment"
    ],
    "காப்பீடு & பாதுகாப்பு": [
      "importance-of-writing-a-will",
      "in-case-of-emergency-kit",
      "insurance-products-in-india",
      "personal-finance-fortification"
    ],
    "தங்கம் & சொத்துகள்": [
      "cryptocurrency-and-nft-trading-india",
      "gold-chits-jeweller-gold-schemes",
      "gold-investing-options-india",
      "hidden-risks-of-real-estate-investments-india",
      "invit",
      "reit"
    ]
  };

  eleventyConfig.addCollection("topics", () => {
    return PRIMARY_TOPICS;
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
  eleventyConfig.addFilter("urlEncode", (value) => encodeURIComponent(String(value || "")));
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
    const slug = article?.fileSlug;
    const mappedPrimary = [];
    if (slug) {
      for (const [primaryTopic, slugs] of Object.entries(TOPIC_MAPPING)) {
        if (slugs.includes(slug)) {
          mappedPrimary.push(primaryTopic);
        }
      }
    }
    return Array.from(new Set([...topics, ...keywords, ...mappedPrimary])).join("|");
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