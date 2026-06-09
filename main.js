document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("is-loading");
  document.body.classList.add("is-loaded");

  const yearElement = document.getElementById("currentYear");
  const revealElements = document.querySelectorAll(".reveal");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxCategory = document.getElementById("lightboxCategory");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDescription = document.getElementById("lightboxDescription");
  const lightboxSoftware = document.getElementById("lightboxSoftware");
  const lightboxVisual = document.getElementById("lightboxVisual");
  const lightboxDialog = lightbox?.querySelector(".lightbox-dialog");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxPlaceholder = document.getElementById("lightboxPlaceholder");
  const lightboxTriggers = document.querySelectorAll(".lightbox-trigger, .portfolio-preview");
  const lightboxCloseTargets = document.querySelectorAll("[data-close-lightbox]");
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");
  const portfolioImages = document.querySelectorAll(".portfolio-image-wrap img");
  const navbarCollapse = document.getElementById("portfolioNav");
  const navbarToggler = document.querySelector(".navbar-toggler");
  const mobileCloseButton = document.getElementById("mobileClose");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link, .navbar-nav .nav-cta");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counters = document.querySelectorAll(".counter");
  const skillBars = document.querySelectorAll(".progress-bar");
  const sections = document.querySelectorAll("main section[id]");
  const buttons = document.querySelectorAll(".btn");
  const typedTitle = document.querySelector(".typed-title");
  const navbar = document.querySelector(".main-navbar");
  const heroSection = document.querySelector(".hero-section");
  let lastScrollY = window.scrollY;
  let filterTimer;
  let lastFocusedElement = null;

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  if (window.Typed && typedTitle && !prefersReducedMotion) {
    new Typed(".typed-title", {
      strings: [
        "Graphic Designer",
        "UI/UX Designer",
        "Frontend Developer"
      ],
      typeSpeed: 58,
      backSpeed: 34,
      backDelay: 1200,
      loop: true,
      smartBackspace: true
    });
  }

  revealElements.forEach((element, index) => {
    let animation = "fade-up";

    if (element.classList.contains("reveal-left")) {
      animation = "fade-right";
    } else if (element.classList.contains("reveal-right")) {
      animation = "fade-left";
    } else if (element.classList.contains("reveal-zoom")) {
      animation = "zoom-in";
    }

    element.setAttribute("data-aos", animation);
    element.setAttribute("data-aos-delay", String(Math.min(index % 4, 3) * 70));
  });

  if (window.AOS && !prefersReducedMotion) {
    AOS.init({
      duration: 750,
      easing: "ease-out-cubic",
      once: true,
      offset: 80
    });
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  portfolioImages.forEach((image) => {
    image.addEventListener("error", () => {
      image.closest(".portfolio-image-wrap")?.classList.add("image-missing");
    });
  });

  function animateCounter(counter) {
    const target = Number(counter.dataset.count || 0);
    const duration = 1100;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));

    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("skill-animated");
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.45 }
    );

    skillBars.forEach((bar) => skillObserver.observe(bar));
  } else {
    counters.forEach((counter) => {
      counter.textContent = counter.dataset.count || "0";
    });
    skillBars.forEach((bar) => bar.classList.add("skill-animated"));
  }

  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();

      ripple.className = "btn-ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      button.appendChild(ripple);

      window.setTimeout(() => ripple.remove(), 650);
    });
  });

  function updateNavbar() {
    const currentScrollY = window.scrollY;

    if (navbar) {
      navbar.classList.toggle("nav-scrolled", currentScrollY > 24);
      navbar.classList.toggle("nav-hidden", currentScrollY > lastScrollY && currentScrollY > 180);
    }

    lastScrollY = currentScrollY;
  }

  function updateActiveLink() {
    let activeId = "home";
    const offset = 140;

    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - offset) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${activeId}`);
    });
  }

  updateNavbar();
  updateActiveLink();

  window.addEventListener("scroll", () => {
    updateNavbar();
    updateActiveLink();
  }, { passive: true });

  if (heroSection && !prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    heroSection.addEventListener("mousemove", (event) => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;

      heroSection.style.setProperty("--parallax-x", `${x}px`);
      heroSection.style.setProperty("--parallax-y", `${y}px`);
    });

    heroSection.addEventListener("mouseleave", () => {
      heroSection.style.setProperty("--parallax-x", "0px");
      heroSection.style.setProperty("--parallax-y", "0px");
    });
  }

  if (navbarCollapse && window.bootstrap) {
    const collapseInstance = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, {
      toggle: false
    });

    const closeMobileMenu = () => {
      if (window.innerWidth < 1200 && navbarCollapse.classList.contains("show")) {
        collapseInstance.hide();
      }
    };

    mobileCloseButton?.addEventListener("click", closeMobileMenu);
    mobileMenuOverlay?.addEventListener("click", closeMobileMenu);

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    navbarCollapse.addEventListener("show.bs.collapse", () => {
      document.body.classList.add("mobile-menu-open");
    });

    navbarCollapse.addEventListener("shown.bs.collapse", () => {
      navbarCollapse.classList.remove("is-closing");
      mobileCloseButton?.focus();
    });

    navbarCollapse.addEventListener("hide.bs.collapse", () => {
      navbarCollapse.classList.add("is-closing");
      navbar?.classList.add("menu-is-closing");
    });

    navbarCollapse.addEventListener("hidden.bs.collapse", () => {
      navbarCollapse.classList.remove("is-closing");
      navbar?.classList.remove("menu-is-closing");
      document.body.classList.remove("mobile-menu-open");
      navbarToggler?.focus();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1200) {
        document.body.classList.remove("mobile-menu-open");
        collapseInstance.hide();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navbarCollapse.classList.contains("show")) {
        closeMobileMenu();
      }
    });
  }

  function escapeAttribute(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      window.clearTimeout(filterTimer);

      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      portfolioItems.forEach((card) => {
        card.classList.add("is-hiding");
      });

      filterTimer = window.setTimeout(() => {
        portfolioItems.forEach((card) => {
          const category = card.dataset.category;
          const shouldShow = filter === "all" || category === filter;

          card.classList.toggle("hidden", !shouldShow);

          if (shouldShow) {
            requestAnimationFrame(() => card.classList.remove("is-hiding"));
          }
        });

        if (window.AOS) {
          AOS.refreshHard();
        }
      }, 180);
    });
  });

  function openLightbox(trigger) {
    if (
      !lightbox ||
      !lightboxCategory ||
      !lightboxTitle ||
      !lightboxDescription ||
      !lightboxSoftware ||
      !lightboxVisual ||
      !lightboxImage ||
      !lightboxPlaceholder
    ) {
      return;
    }

    const title = trigger.dataset.title || "Project Preview";
    const category = trigger.dataset.category || "Portfolio";
    const description = trigger.dataset.description || "Creative project preview.";
    const software = trigger.dataset.software || "Add software used";
    const imagePath = trigger.dataset.image || "";

    lightboxCategory.textContent = category;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    lightboxSoftware.innerHTML = `<strong>Software:</strong> ${software}`;
    lightboxVisual.className = "lightbox-visual";
    lightboxVisual.classList.add(`preview-${getPreviewType(category)}`);
    lightboxVisual.scrollTop = 0;
    lightboxImage.alt = title;
    lightboxPlaceholder.innerHTML = '<i class="fa-solid fa-image"></i> Project image unavailable';
    lastFocusedElement = document.activeElement;

    if (imagePath) {
      lightboxImage.onload = () => {
        lightboxVisual.classList.remove("image-missing");
      };
      lightboxImage.onerror = () => {
        lightboxVisual.classList.add("image-missing");
        lightboxPlaceholder.innerHTML = `<i class="fa-solid fa-image"></i> Unable to load ${escapeAttribute(imagePath)}`;
      };
      lightboxImage.src = imagePath;
    } else {
      lightboxVisual.classList.add("image-missing");
      lightboxImage.removeAttribute("src");
    }

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => lightboxDialog?.focus());
  }

  function closeLightbox() {
    if (!lightbox) {
      return;
    }

    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lastFocusedElement?.focus();
  }

  function getPreviewType(category) {
    const normalizedCategory = category.toLowerCase();

    if (normalizedCategory.includes("website")) return "web";
    if (normalizedCategory.includes("mobile")) return "mobile";
    if (normalizedCategory.includes("business")) return "business";
    if (normalizedCategory.includes("banner")) return "banner";
    if (normalizedCategory.includes("logo")) return "logo";
    return "social";
  }

  if (lightbox) {
    lightboxTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => openLightbox(trigger));
    });

    lightboxCloseTargets.forEach((target) => {
      target.addEventListener("click", closeLightbox);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }

    if (event.key === "Tab" && lightbox?.classList.contains("is-open")) {
      const focusableElements = lightbox.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    }
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        formMessage.textContent = "Please complete the required fields before sending your message.";
        formMessage.className = "form-message error";
        return;
      }

      formMessage.textContent = "Thanks for reaching out. This demo form is ready to connect with Formspree, Netlify Forms, or your backend.";
      formMessage.className = "form-message success";
      contactForm.reset();
    });
  }
});
