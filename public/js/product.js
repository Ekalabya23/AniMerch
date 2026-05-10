document.getElementById("year").textContent = new Date().getFullYear();
const thumbs = document.querySelectorAll(".thumb");
const mainImg = document.getElementById("mainImgEl");

thumbs.forEach((t) => {
  t.addEventListener("click", () => {
    thumbs.forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    const src = t.dataset.src;
    mainImg.style.opacity = 0;
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = 1;
    }, 180);
  });
});

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

document.addEventListener("click", (e) => {
  const el = e.target.closest(".ripple");
  if (!el) return;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--x", e.clientX - rect.left + "px");
  el.style.setProperty("--y", e.clientY - rect.top + "px");

  el.classList.remove("ripple-animate");
  void el.offsetWidth;
  el.classList.add("ripple-animate");
});

document.getElementById("addCart").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.classList.add("loading");
  setTimeout(() => {
    btn.classList.remove("loading");
    btn.textContent = "Added ✓";
    setTimeout(() => (btn.textContent = "Add to Cart"), 1500);
  }, 600);
});

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

const postReview = async (review, rating, product) => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:4000/api/v1/review",
      {
        review,
        rating,
        product,
        createdAt: Date.now(),
      },
      { withCredentials: true }
    );
    if (res.status === 201) location.reload(true);
  } catch (err) {
    alert(err);
  }
};

document.getElementById("postReview").addEventListener("click", () => {
  const rating = document.getElementById("rRating").value;
  const review = document.getElementById("rText").value;
  const product = document.getElementById("productId").value;
  postReview(review, rating, product);
});

const addToCart = async (product, quantity) => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:4000/api/v1/users/cart",
      {
        product,
        quantity,
      },
      { withCredentials: true }
    );
    if (res.status === 200) location.reload(true);
  } catch (err) {
    alert(err);
  }
};

document.getElementById("addCart").addEventListener("click", () => {
  const product = document.getElementById("productId").value;
  const quantity = document.getElementById("qtyVal").textContent;
  console.log(quantity);
  addToCart(product, quantity);
});
