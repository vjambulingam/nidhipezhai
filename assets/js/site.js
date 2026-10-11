const searchInput = document.querySelector("#global-search");
const searchResults = [...document.querySelectorAll("[data-search-result]")];
const topicButtons = [...document.querySelectorAll("[data-topic]")];
const emptyState = document.querySelector("#empty-state");
const resultsCount = document.querySelector("#results-count");

if (searchInput && searchResults.length) {
  let selectedTopic = "all";

  function filterArticles() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    for (const card of searchResults) {
      const searchableText = (card.dataset.search || "").toLocaleLowerCase();
      const topics = (card.dataset.topics || "").split("|");
      const isArticle = card.dataset.searchType === "article";
      const matchesQuery = searchableText.includes(query);
      const matchesTopic = !isArticle || selectedTopic === "all" || topics.includes(selectedTopic);
      const visible = matchesQuery && matchesTopic && (isArticle || query.length > 0);

      card.hidden = !visible;
      if (visible) visibleCount += 1;
    }

    emptyState.hidden = visibleCount !== 0;
    resultsCount.textContent = `${visibleCount} முடிவுகள்`;
  }

  searchInput.addEventListener("input", filterArticles);

  for (const button of topicButtons) {
    button.addEventListener("click", () => {
      selectedTopic = button.dataset.topic;
      for (const item of topicButtons) {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      }
      filterArticles();
    });
  }
}