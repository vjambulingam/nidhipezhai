module.exports = {
  layout: "layouts/checklist.njk",
  templateEngineOverride: false,
  eleventyExcludeFromCollections: true,
  eleventyComputed: {
    permalink: (data) => `/checklists/${data.page.fileSlug}.html`
  }
};

