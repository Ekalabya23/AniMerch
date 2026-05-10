// Interactive behavior:
// - clicking a card centers it (adds .center to the clicked card)
// - hover/focus animations are CSS-driven; JS moves center on click
const row = document.getElementById("row");
const cards = Array.from(document.querySelectorAll(".card"));

// helper to set center index
function setCenter(idx) {
  cards.forEach((c, i) => c.classList.toggle("center", i === idx));
  // scroll the row so the center is roughly in view
  const card = cards[idx];
  if (card) {
    const rect = card.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    // center card horizontally in the row viewport
    const offset =
      (rect.left + rect.right) / 2 - (rowRect.left + rowRect.right) / 2;
    row.scrollBy({ left: offset, behavior: "smooth" });
    // focus the card for keyboard users
    card.focus({ preventScroll: true });
  }
}

// make the middle card centered initially (index 2)
const initial = Math.floor(cards.length / 2);
setCenter(initial);

// click centers card and triggers a demo action
cards.forEach((card, i) => {
  card.addEventListener("click", (e) => {
    setCenter(i);
    // small demo: open a product detail or navigate. Replace with real link:
    // location.href = '/product/' + (card.dataset.slug || encodeURIComponent(card.dataset.title.toLowerCase()));
  });

  // keyboard: Enter opens center action
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setCenter(i);
    }
  });

  // on hover, show shop now popup handled by CSS
  // but also highlight with JS if you want fine control (not necessary)
});

// optional: use arrow keys to move center
document.addEventListener("keydown", (e) => {
  const idx = cards.findIndex((c) => c.classList.contains("center"));
  if (e.key === "ArrowLeft") setCenter(Math.max(0, idx - 1));
  if (e.key === "ArrowRight") setCenter(Math.min(cards.length - 1, idx + 1));
});
