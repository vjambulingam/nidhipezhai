module.exports = {
  language: "en",
  eleventyExcludeFromCollections: false,
  eleventyComputed: {
    permalink: (data) => data.publishedEnglish === false ? false : `/en/checklists/${data.page.fileSlug}.html`
  }
};
