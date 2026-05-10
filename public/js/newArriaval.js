(function () {
  const viewport = document.getElementById("animViewport");
  const row = document.getElementById("animRow");
  if (!viewport || !row) return;

  const originalNodes = Array.from(row.children);
  const originalCount = originalNodes.length;
  if (originalCount === 0) return;

  const prependFrag = document.createDocumentFragment();
  const appendFrag = document.createDocumentFragment();

  for (let i = originalCount - 1; i >= 0; i--) {
    prependFrag.insertBefore(
      originalNodes[i].cloneNode(true),
      prependFrag.firstChild
    );
  }
  for (let i = 0; i < originalCount; i++) {
    appendFrag.appendChild(originalNodes[i].cloneNode(true));
  }

  row.insertBefore(prependFrag, row.firstChild);
  row.appendChild(appendFrag);

  let fullNodes = Array.from(row.children);
  const total = fullNodes.length;

  let serverIndex = originalNodes.findIndex((n) =>
    n.hasAttribute("data-center")
  );
  if (serverIndex === -1) serverIndex = Math.floor(originalCount / 2);

  let centerIndex = originalCount + serverIndex;

  // ✅ Fixed scrollToIndex (container only, no page jump)
  function scrollToIndex(idx, behavior = "smooth") {
    const el = fullNodes[idx];
    if (!el) return;
    const scrollContainer = viewport;
    const containerCenter = scrollContainer.offsetWidth / 2;
    const targetCenter = el.offsetLeft + el.offsetWidth / 2;
    const scrollLeft = targetCenter - containerCenter;

    scrollContainer.scrollTo({
      left: scrollLeft,
      behavior: behavior,
    });
  }

  function applyClasses() {
    fullNodes = Array.from(row.children);
    fullNodes.forEach((el, i) => {
      el.classList.remove("anim-center", "anim-near", "anim-far", "active");
      if (i === centerIndex) el.classList.add("anim-center", "active");
      else if (
        i === centerIndex - 1 ||
        (centerIndex === 0 && i === fullNodes.length - 1)
      )
        el.classList.add("anim-near");
      else if (
        i === centerIndex + 1 ||
        (centerIndex === fullNodes.length - 1 && i === 0)
      )
        el.classList.add("anim-near");
      else el.classList.add("anim-far");
    });
  }

  function normalizeIndexIfNeeded() {
    const startOriginal = originalCount;
    const endOriginal = originalCount * 2 - 1;

    if (centerIndex > endOriginal) {
      const offset = centerIndex - originalCount * 2;
      centerIndex = originalCount + offset;
      scrollToIndex(centerIndex, "auto");
      applyClasses();
    } else if (centerIndex < startOriginal) {
      const offset = centerIndex;
      centerIndex = originalCount + offset;
      scrollToIndex(centerIndex, "auto");
      applyClasses();
    }
  }

  function next() {
    centerIndex = (centerIndex + 1) % fullNodes.length;
    scrollToIndex(centerIndex, "smooth");
    applyClasses();
    setTimeout(normalizeIndexIfNeeded, 520);
  }
  function prev() {
    centerIndex = (centerIndex - 1 + fullNodes.length) % fullNodes.length;
    scrollToIndex(centerIndex, "smooth");
    applyClasses();
    setTimeout(normalizeIndexIfNeeded, 520);
  }

  const DELAY = 1500;
  let timer = null;
  let paused = false;
  function start() {
    stop();
    timer = setInterval(() => {
      if (!paused) next();
    }, DELAY);
  }
  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function restart() {
    stop();
    start();
  }

  fullNodes.forEach((el, idx) => {
    el.addEventListener("click", () => {
      centerIndex = idx;
      scrollToIndex(centerIndex, "smooth");
      applyClasses();
      setTimeout(normalizeIndexIfNeeded, 520);
      restart();
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        centerIndex = idx;
        scrollToIndex(centerIndex, "smooth");
        applyClasses();
        setTimeout(normalizeIndexIfNeeded, 520);
        restart();
      }
    });
  });

  const prevBtn = document.getElementById("animPrev");
  const nextBtn = document.getElementById("animNext");
  if (prevBtn)
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      prev();
    });
  if (nextBtn)
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      next();
    });

  viewport.addEventListener("mouseenter", () => (paused = true));
  viewport.addEventListener("mouseleave", () => (paused = false));
  viewport.addEventListener("focusin", () => (paused = true));
  viewport.addEventListener("focusout", () => (paused = false));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  const imgs = row.querySelectorAll("img");
  let pending = imgs.length;
  if (pending === 0) {
    scrollToIndex(centerIndex, "auto");
    applyClasses();
    start();
  } else {
    imgs.forEach((img) => {
      if (img.complete) {
        pending--;
      } else
        img.addEventListener(
          "load",
          () => {
            pending--;
            if (pending === 0) {
              scrollToIndex(centerIndex, "auto");
              applyClasses();
              start();
            }
          },
          { once: true }
        );
      img.addEventListener(
        "error",
        () => {
          pending--;
          if (pending === 0) {
            scrollToIndex(centerIndex, "auto");
            applyClasses();
            start();
          }
        },
        { once: true }
      );
    });
    setTimeout(() => {
      if (!timer) {
        scrollToIndex(centerIndex, "auto");
        applyClasses();
        start();
      }
    }, 900);
  }

  let rTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(rTimer);
    rTimer = setTimeout(() => {
      scrollToIndex(centerIndex, "auto");
      applyClasses();
    }, 120);
  });

  window.__animaze_infinite = {
    next,
    prev,
    jumpTo: (idx) => {
      centerIndex = originalCount + (idx % originalCount);
      scrollToIndex(centerIndex, "smooth");
      applyClasses();
      setTimeout(normalizeIndexIfNeeded, 520);
    },
  };
})();
