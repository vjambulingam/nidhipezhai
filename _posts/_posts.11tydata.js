module.exports = {
  tags: ["articles"],
  layout: "layouts/article.njk",
  eleventyComputed: {
    permalink: (data) => `/articles/${data.page.fileSlug}/index.html`,
    seoType: "article"
  }
};