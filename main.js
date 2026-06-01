document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("currentYear");
  const revealElements = document.querySelectorAll(".reveal");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxCategory = document.getElementById("lightboxCategory");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDescription = document.getElementById("lightboxDescription");
  const lightboxVisual = document.getElementById("lightboxVisual");
  const lightboxTriggers = document.querySelectorAll(".lightbox-trigger, .portfolio-preview");
  const lightboxCloseTargets = document.querySelectorAll("[data-close-lightbox]");
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

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

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      portfolioItems.forEach((card) => {
        const category = card.dataset.category;
        const shouldShow = filter === "all" || category === filter;
        card.classList.toggle("hidden", !shouldShow);
      });
    });
  });

  function openLightbox(trigger) {
    const title = trigger.dataset.title || "Project Preview";
    const category = trigger.dataset.category || "Portfolio";
    const description = trigger.dataset.description || "Creative project preview.";

    lightboxCategory.textContent = category;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    lightboxVisual.innerHTML = '<i class="fa-solid fa-image"></i>';

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  lightboxTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openLightbox(trigger));
  });

  lightboxCloseTargets.forEach((target) => {
    target.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
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
