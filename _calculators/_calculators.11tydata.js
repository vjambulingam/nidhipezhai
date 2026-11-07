module.exports = {
  layout: "layouts/calculator.njk",
  toolKind: "calculator",
  templateEngineOverride: false,
  eleventyExcludeFromCollections: true,
  eleventyComputed: {
    permalink: (data) => `/calculators/${data.page.fileSlug}.html`
  }
};
