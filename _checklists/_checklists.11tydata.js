module.exports = {
  layout: "layouts/checklist.njk",
  toolKind: "checklist",
  templateEngineOverride: false,
  eleventyExcludeFromCollections: true,
  eleventyComputed: {
    permalink: (data) => `/checklists/${data.page.fileSlug}.html`
  }
};
