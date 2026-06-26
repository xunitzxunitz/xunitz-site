const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const parallaxLayer = document.querySelector("[data-parallax]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const bentoGrids = document.querySelectorAll(".bento-grid");

function updateBentoGridMetrics() {
  bentoGrids.forEach((grid) => {
    const styles = getComputedStyle(grid);
    const columns = styles.gridTemplateColumns.split(" ").filter(Boolean);
    const gap = parseFloat(styles.columnGap) || 0;
    const cell = columns.length ? parseFloat(columns[0]) : 0;

    if (cell > 0) {
      grid.style.setProperty("--grid-cell", `${cell}px`);
      grid.style.setProperty("--grid-gap", `${gap}px`);
    }
  });
}

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);

  if (parallaxLayer && !prefersReducedMotion.matches && window.innerWidth > 760) {
    parallaxLayer.style.transform = `translate3d(0, ${window.scrollY * 0.08}px, 0)`;
  }
}

function closeMenu() {
  nav?.classList.remove("is-open");
  header?.classList.remove("menu-open");
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");

  header?.classList.toggle("menu-open", Boolean(isOpen));
  document.body.classList.toggle("nav-open", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId?.startsWith("#") ? document.querySelector(targetId) : null;

    if (target && !prefersReducedMotion.matches) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", targetId);
    }

    closeMenu();
  });
});

const observer = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" })
  : null;

document.querySelectorAll(".reveal").forEach((element) => {
  if (observer && !prefersReducedMotion.matches) {
    observer.observe(element);
  } else {
    element.classList.add("is-visible");
  }
});

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  updateHeader();
  updateBentoGridMetrics();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

updateHeader();
updateBentoGridMetrics();
