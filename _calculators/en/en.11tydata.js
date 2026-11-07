module.exports = {
  language: "en",
  eleventyExcludeFromCollections: false,
  eleventyComputed: {
    permalink: (data) => data.publishedEnglish === false ? false : `/en/calculators/${data.page.fileSlug}.html`
  }
};
