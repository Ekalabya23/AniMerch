// Setup year
document.getElementById("year").textContent = new Date().getFullYear();
// Thumbnail click to change main image + active class
const thumbs = document.querySelectorAll(".thumb");
const mainImg = document.getElementById("mainImgEl");
thumbs.forEach((t) => {
  t.addEventListener("click", () => {
    thumbs.forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    const src = t.dataset.src;
    // fade transition
    mainImg.style.opacity = 0;
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = 1;
    }, 180);
  });
});
// quantity controls
let qty = 1;
const qtyVal = document.getElementById("qtyVal");
document.getElementById("incQty").addEventListener("click", () => {
  qty = Math.min(10, qty + 1);
  qtyVal.textContent = qty;
});
document.getElementById("decQty").addEventListener("click", () => {
  qty = Math.max(1, qty - 1);
  qtyVal.textContent = qty;
});
// ripple effect on buttons (delegated)
document.addEventListener("click", (e) => {
  const el = e.target.closest(".ripple");
  if (!el) return;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--x", e.clientX - rect.left + "px");
  el.style.setProperty("--y", e.clientY - rect.top + "px");
  // restart animation by toggling class
  el.classList.remove("ripple-animate");
  void el.offsetWidth;
  el.classList.add("ripple-animate");
});
// add to cart button animation + simple toast
document.getElementById("addCart").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.classList.add("loading");
  setTimeout(() => {
    btn.classList.remove("loading");
    // small confirm effect
    btn.textContent = "Added ✓";
    setTimeout(() => (btn.textContent = "Add to Cart"), 1500);
  }, 600);
});
// REVIEW logic: add and persist to localStorage (client-only)
const reviewListEl = document.getElementById("reviewList");
const postBtn = document.getElementById("postReview");
function renderReviewItem(item) {
  const div = document.createElement("div");
  div.className = "review";
  div.innerHTML = `
          <div class="avatar"><img src="${item.avatar}" alt="avatar"></div>
          <div class="rev-body">
            <div class="rev-meta">
              <div class="rev-name">${escapeHtml(item.name)}</div>
              <div class="rev-stars">${"★".repeat(item.rating)}${"☆".repeat(
    5 - item.rating
  )}</div>
              <div style="margin-left:auto;color:var(--muted);font-size:13px">${
                item.time
              }</div>
            </div>
            <div class="rev-text">${escapeHtml(item.text)}</div>
          </div>
        `;
  reviewListEl.prepend(div);
}
function escapeHtml(s) {
  return (s + "").replace(
    /[&<>"']/g,
    (ch) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[ch])
  );
}
// load previous reviews from localStorage (or keep sample)
const storageKey = "animaze_reviews_demo";
const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
existing.forEach((r) => renderReviewItem(r));
postBtn.addEventListener("click", () => {
  const name = document.getElementById("rName").value.trim() || "Anonymous";
  const rating = parseInt(document.getElementById("rRating").value, 10) || 5;
  const text = document.getElementById("rText").value.trim() || "Nice product!";
  const item = {
    name,
    rating,
    text,
    avatar:
      "https://i.pravatar.cc/60?u=" + encodeURIComponent(name + Date.now()),
    time: "just now",
  };
  // save
  existing.push(item);
  localStorage.setItem(storageKey, JSON.stringify(existing.slice(-50)));
  renderReviewItem(item);
  // clear
  document.getElementById("rName").value = "";
  document.getElementById("rText").value = "";
});
