const searchInput = document.querySelector("#global-search");
const searchResults = [...document.querySelectorAll("[data-search-result]")];
const topicButtons = [...document.querySelectorAll("[data-topic]")];
const emptyState = document.querySelector("#empty-state");
const resultsCount = document.querySelector("#results-count");

if (searchInput && searchResults.length) {
  const params = new URLSearchParams(window.location.search);
  let selectedTopic = params.get("topic") || "all";
  if (params.get("q")) {
    searchInput.value = params.get("q");
  }

  function syncActiveButton() {
    let matched = false;
    for (const item of topicButtons) {
      const active = item.dataset.topic === selectedTopic;
      if (active) matched = true;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    }
    if (!matched && topicButtons.length) {
      selectedTopic = "all";
      topicButtons[0].classList.add("is-active");
      topicButtons[0].setAttribute("aria-pressed", "true");
    }
  }

  function updateUrlParams(query) {
    const nextParams = new URLSearchParams(window.location.search);
    if (query) {
      nextParams.set("q", query);
    } else {
      nextParams.delete("q");
    }
    if (selectedTopic && selectedTopic !== "all") {
      nextParams.set("topic", selectedTopic);
    } else {
      nextParams.delete("topic");
    }
    const qs = nextParams.toString();
    const nextUrl = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", nextUrl);
  }

  function filterArticles(syncUrl = true) {
    const query = searchInput.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    for (const card of searchResults) {
      const searchableText = (card.dataset.search || "").toLocaleLowerCase();
      const topics = (card.dataset.topics || "").split("|");
      const searchType = card.dataset.searchType;
      const isArticle = searchType === "article";
      const matchesQuery = searchableText.includes(query);

      let matchesFilter = false;
      if (selectedTopic === "__calculator") {
        matchesFilter = searchType === "calculator";
      } else if (selectedTopic === "__checklist") {
        matchesFilter = searchType === "checklist";
      } else if (selectedTopic === "all") {
        matchesFilter = isArticle || query.length > 0;
      } else {
        matchesFilter = isArticle && topics.includes(selectedTopic);
      }

      const visible = matchesQuery && matchesFilter;
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
        const topicElem = card.querySelector(".article-card__topic");
        if (topicElem && card.dataset.allTopics) {
          const allTopics = card.dataset.allTopics.split("|").filter(Boolean);
          if (selectedTopic && selectedTopic !== "all" && !selectedTopic.startsWith("__")) {
            topicElem.textContent = selectedTopic;
          } else if (query) {
            const matchingTopics = allTopics.filter(t => t.toLocaleLowerCase().includes(query) || query.includes(t.toLocaleLowerCase()));
            topicElem.textContent = matchingTopics.length > 0 ? matchingTopics.join(" · ") : allTopics.join(" · ");
          } else {
            topicElem.textContent = allTopics.join(" · ");
          }
        }
      }
    }

    emptyState.hidden = visibleCount !== 0;
    resultsCount.textContent = `${visibleCount} முடிவுகள்`;
    if (syncUrl) {
      updateUrlParams(query);
    }
  }

  syncActiveButton();
  filterArticles(false);

  searchInput.addEventListener("input", () => filterArticles(true));

  for (const button of topicButtons) {
    button.addEventListener("click", () => {
      selectedTopic = button.dataset.topic;
      syncActiveButton();
      filterArticles(true);
    });
  }
}

const tocNav = document.querySelector("#article-toc");
const tocList = document.querySelector("#article-toc-list");
const articleHeadings = [...document.querySelectorAll(".article__body h2")];

if (tocNav && tocList && articleHeadings.length >= 2) {
  articleHeadings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `section-${index + 1}`;
    }
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.replace(/^\s*\d+[\.\)\-:]\s*/, "");
    li.appendChild(link);
    tocList.appendChild(li);
  });
  tocNav.hidden = false;
}