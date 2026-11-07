module.exports = {
  eleventyExcludeFromCollections: false,
  language: "en",
  eleventyComputed: {
    permalink: (data) => data.draft === true ? false : `/en/articles/${data.page.fileSlug}/index.html`
  }
};
