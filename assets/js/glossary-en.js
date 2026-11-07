document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("glossary-search-input");
  const categories = document.querySelectorAll(".glossary-cat-btn");
  const letters = document.querySelectorAll(".glossary-letter-btn");
  const cards = document.querySelectorAll(".glossary-card");
  const count = document.getElementById("glossary-count");
  const empty = document.getElementById("glossary-empty");
  let category = "all";
  let letter = "all";

  function setSelected(buttons, selected, key) {
    buttons.forEach((button) => {
      const active = button.dataset[key] === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function filter() {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const match = (category === "all" || card.dataset.cat === category) &&
        (letter === "all" || card.dataset.letter === letter) &&
        card.dataset.search.includes(query);
      card.hidden = !match;
      if (match) visible++;
    });
    count.textContent = `${visible} ${visible === 1 ? "term" : "terms"} shown`;
    empty.hidden = visible !== 0;
  }

  search.addEventListener("input", () => {
    if (search.value && letter !== "all") {
      letter = "all";
      setSelected(letters, letter, "letter");
    }
    filter();
  });
  categories.forEach((button) => button.addEventListener("click", () => {
    category = button.dataset.cat;
    setSelected(categories, category, "cat");
    filter();
  }));
  letters.forEach((button) => button.addEventListener("click", () => {
    letter = button.dataset.letter;
    setSelected(letters, letter, "letter");
    filter();
  }));
  document.getElementById("glossary-reset-btn").addEventListener("click", () => {
    search.value = "";
    category = "all";
    letter = "all";
    setSelected(categories, category, "cat");
    setSelected(letters, letter, "letter");
    filter();
  });
});
