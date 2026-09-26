const searchInput = document.querySelector("#article-search");
const articleCards = [...document.querySelectorAll("[data-article-card]")];
const topicButtons = [...document.querySelectorAll("[data-topic]")];
const emptyState = document.querySelector("#empty-state");
const resultsCount = document.querySelector("#results-count");

if (searchInput && articleCards.length) {
  let selectedTopic = "all";

  function filterArticles() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    for (const card of articleCards) {
      const searchableText = (card.dataset.search || "").toLocaleLowerCase();
      const topics = (card.dataset.topics || "").split("|");
      const matchesQuery = searchableText.includes(query);
      const matchesTopic = selectedTopic === "all" || topics.includes(selectedTopic);
      const visible = matchesQuery && matchesTopic;

      card.hidden = !visible;
      if (visible) visibleCount += 1;
    }

    emptyState.hidden = visibleCount !== 0;
    resultsCount.textContent = `${visibleCount} கட்டுரைகள்`;
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