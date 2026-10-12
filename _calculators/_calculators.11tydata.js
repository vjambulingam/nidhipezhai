module.exports = {
  layout: "layouts/calculator.njk",
  templateEngineOverride: false,
  eleventyExcludeFromCollections: true,
  eleventyComputed: {
    permalink: (data) => `/calculators/${data.page.fileSlug}.html`
  }
};

