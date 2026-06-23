// --- Project Dataset ---
const PROJECTS = [
  {
    id: 1,
    title: "Summer Music Festival Flyer",
    category: "designing",
    subcategory: "Flyer Making",
    description: "A vibrant, energetic poster and social media flyer designed to promote an outdoor electronic music festival. Uses high-contrast neon gradients and custom visual assets.",
    details: "Designed for 'Sonic Waves Collective', this flyer was used across Instagram, Facebook, and physical street postings. The design concept focuses on wave patterns and light emissions to mimic high-intensity electronic concerts. The layouts were delivered in multiple aspect ratios (1:1, 9:16, and A4 print-ready).",
    client: "Sonic Waves Collective",
    images: [
      "assets/flyer_design.png",
      "assets/flyer_mockup_2.png" // Fallbacks handled by onerror in rendering
    ],
    technologies: ["Adobe Photoshop", "Visual Design", "Typography", "Color Theory"],
    link: "https://dribbble.com"
  },
  {
    id: 2,
    title: "Minimalist Corporate Business Card",
    category: "designing",
    subcategory: "Business Card Designs",
    description: "A premium, minimalist business card with luxury textures, blind debossing effects, and clean modern layout guidelines.",
    details: "Created for 'Apex Consultancy Group' as part of their complete rebranding. The card uses a rich HSL charcoal black background combined with gold foil accents and geometric blind debossing. Delivered as print-ready vector files with exact bleed margins and spot UV mask specifications.",
    client: "Apex Consultancy Group",
    images: [
      "assets/business_card.png"
    ],
    technologies: ["Adobe Illustrator", "Corporate Branding", "Print Production", "Typography"],
    link: "https://behance.net"
  },
  {
    id: 3,
    title: "3D Product Promo Animation",
    category: "designing",
    subcategory: "Video Animations",
    description: "A sleek, high-frame-rate commercial motion graphics advertisement showcasing a luxury smart watch concept.",
    details: "A 30-second promotional animation highlighting the watch's water resistance, titanium chassis, and interactive display. Features smooth transition sweeps, particle effects, and atmospheric background audio syncing. Rendered in full HD for social media campaigns.",
    client: "Chronos Wearables",
    images: [
      "assets/motion_graphics.png"
    ],
    technologies: ["After Effects", "Cinema 4D", "Motion Graphics", "Video Editing"],
    link: "https://youtube.com"
  },
  {
    id: 4,
    title: "Sleek SaaS Analytics Dashboard",
    category: "development",
    subcategory: "Web Applications",
    description: "A highly responsive, dark-themed business analytics dashboard with interactive data charts, grid management, and client notifications.",
    details: "Developed as a custom client portal for tracking operational metrics. Built using raw HTML/CSS/JS with optimized CSS variables for smooth light/dark switching. The charts render using native Canvas integrations for peak performance.",
    client: "DevFlow Systems",
    images: [
      "assets/web_app.png"
    ],
    technologies: ["HTML5", "CSS Grid/Flexbox", "Vanilla JavaScript", "Charts.js"],
    link: "https://github.com"
  },
  {
    id: 5,
    title: "Automated Lead Generation Script",
    category: "development",
    subcategory: "Automation Scripts",
    description: "A robust Python automation pipeline that crawls permitted listings and aggregates sales leads into structured reports.",
    details: "A background script that compiles relevant B2B contact info from public portals, runs validation on emails, and generates clean CSV summaries. Includes error logs, rate limiting to avoid server overload, and automated daily email reports via SMTP.",
    client: "Inbound Marketing Inc.",
    images: [
      "assets/script_terminal.png"
    ],
    technologies: ["Python", "BeautifulSoup", "Pandas", "SMTP Email Automation"],
    link: "https://github.com"
  },
  {
    id: 6,
    title: "Corporate Identity Brand Flyer",
    category: "designing",
    subcategory: "Flyer Making",
    description: "A clean, modern corporate leaflet designed to pitch premium consulting services to small and medium enterprises.",
    details: "Developed a double-sided A5 informational flyer for regional distributions. Follows strict geometric layouts, using professional typography and custom vector diagrams to explain services. Features high-quality corporate headshots and clear CTAs.",
    client: "Nexus Advisors",
    images: [
      "assets/flyer_design.png"
    ],
    technologies: ["Adobe InDesign", "Graphic Design", "Grid Systems", "Print Production"],
    link: "https://behance.net"
  }
];

// --- Subcategory Options Mapping ---
const SUBCATEGORIES = {
  designing: ["Flyer Making", "Business Card Designs", "Video Animations"],
  development: ["Web Applications", "Automation Scripts"]
};

// --- DOM Elements ---
const gridContainer = document.getElementById("portfolio-grid");
const categoryFiltersContainer = document.getElementById("category-filters");
const subcategoryFiltersContainer = document.getElementById("subcategory-filters-container");
const searchInput = document.getElementById("portfolio-search");

// Navigation elements
const header = document.querySelector(".header");
const mobileToggle = document.getElementById("mobile-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

// Modal elements
const modal = document.getElementById("project-modal");
const modalClose = document.getElementById("modal-close");
const modalSlider = document.getElementById("modal-slider");
const modalPrev = document.getElementById("slider-prev");
const modalNext = document.getElementById("slider-next");
const modalDots = document.getElementById("slider-dots");
const modalCategory = document.getElementById("modal-tag-category");
const modalSubcategory = document.getElementById("modal-tag-subcategory");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalClient = document.getElementById("modal-client");
const modalTechTags = document.getElementById("modal-tech-tags");
const modalActionBtn = document.getElementById("modal-action-btn");

// Theme Toggle
const themeToggleBtn = document.getElementById("theme-toggle");

// Tabs element
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Contact Form elements
const contactForm = document.getElementById("contact-form");
const formSuccessOverlay = document.getElementById("form-success");
const formResetBtn = document.getElementById("btn-success-reset");

// --- State Variables ---
let currentCategory = "all";
let currentSubcategory = "all";
let searchQuery = "";
let currentSlideIndex = 0;
let modalActiveImages = [];

// --- Initialize App ---
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderPortfolio();
  renderSubcategoryFilters();
  setupEventListeners();
});

// --- Theme Management ---
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

// --- Render Functions ---

function renderPortfolio() {
  // Filter dataset
  const filtered = PROJECTS.filter(project => {
    const matchesCategory = currentCategory === "all" || project.category === currentCategory;
    const matchesSubcategory = currentSubcategory === "all" || project.subcategory === currentSubcategory;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === "" ||
      project.title.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower) ||
      project.subcategory.toLowerCase().includes(searchLower) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchLower));

    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  // Render HTML
  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: var(--color-text-muted);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 3.5rem; height: 3.5rem; margin-bottom: 1rem; color: var(--color-text-muted);">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <h3>No projects found</h3>
        <p>Try searching for a different keyword or resetting your filters.</p>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = filtered.map(project => {
    const techTags = project.technologies.slice(0, 3).map(tech => `<span class="card-tag">${tech}</span>`).join("");
    // Standard preview fallback image
    const mainImg = project.images[0];

    return `
      <article class="portfolio-card" data-id="${project.id}">
        <div class="card-image-wrapper">
          <img src="${mainImg}" alt="${project.title}" class="card-img" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 600 400%22><rect width=%22100%%22 height=%22100%%22 fill=%22%231e293b%22/><circle cx=%22300%22 cy=%22200%22 r=%2260%22 fill=%22%236366f1%22 opacity=%220.6%22/><text x=%2250%%22 y=%2250%%22 font-family=%22Outfit%22 font-size=%2220%22 fill=%22%23ffffff%22 text-anchor=%22middle%22 dy=%22.3em%22>${project.subcategory}</text></svg>'">
          <div class="card-overlay">
            <button class="overlay-btn" aria-label="View Project Details">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="card-info">
          <div class="card-meta">
            <span class="card-category">${project.category}</span>
            <span class="card-subcategory">${project.subcategory}</span>
          </div>
          <h3 class="card-title">${project.title}</h3>
          <p class="card-desc">${project.description}</p>
          <div class="card-tags">
            ${techTags}
            ${project.technologies.length > 3 ? `<span class="card-tag">+${project.technologies.length - 3}</span>` : ""}
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Re-bind modal triggers
  document.querySelectorAll(".portfolio-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = parseInt(card.getAttribute("data-id"));
      openModal(id);
    });
  });
}

function renderSubcategoryFilters() {
  if (currentCategory === "all") {
    // Show no subfilters or optionally list all of them
    subcategoryFiltersContainer.innerHTML = "";
    return;
  }

  const subcats = SUBCATEGORIES[currentCategory] || [];

  let html = `<button class="subfilter-btn ${currentSubcategory === "all" ? "active" : ""}" data-sub="all">All ${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}</button>`;

  html += subcats.map(sub => {
    return `<button class="subfilter-btn ${currentSubcategory === sub ? "active" : ""}" data-sub="${sub}">${sub}</button>`;
  }).join("");

  subcategoryFiltersContainer.innerHTML = html;

  // Add click handlers
  document.querySelectorAll(".subfilter-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".subfilter-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentSubcategory = e.target.getAttribute("data-sub");
      renderPortfolio();
    });
  });
}

// --- Modal Slider Logic ---
function updateSlider() {
  modalSlider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

  // Update dots
  const dots = modalDots.querySelectorAll(".dot");
  dots.forEach((dot, idx) => {
    if (idx === currentSlideIndex) dot.classList.add("active");
    else dot.classList.remove("active");
  });
}

function initSlider(images, subcategory) {
  modalActiveImages = images;
  currentSlideIndex = 0;

  // Render slides
  modalSlider.innerHTML = images.map(img => {
    return `
      <div class="slide">
        <img src="${img}" alt="Project slide" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 600 400%22><rect width=%22100%%22 height=%22100%%22 fill=%22%23060911%22/><circle cx=%22300%22 cy=%22200%22 r=%2250%22 fill=%22%23a855f7%22 opacity=%220.5%22/><text x=%2250%%22 y=%2250%%22 font-family=%22Outfit%22 font-size=%2222%22 fill=%22%23ffffff%22 text-anchor=%22middle%22 dy=%22.3em%22>${subcategory}</text></svg>'">
      </div>
    `;
  }).join("");

  // Render dots
  if (images.length > 1) {
    modalPrev.style.display = "flex";
    modalNext.style.display = "flex";
    modalDots.innerHTML = images.map((_, idx) => `<span class="dot ${idx === 0 ? "active" : ""}" data-idx="${idx}"></span>`).join("");

    // Bind dot clicks
    modalDots.querySelectorAll(".dot").forEach(dot => {
      dot.addEventListener("click", (e) => {
        currentSlideIndex = parseInt(e.target.getAttribute("data-idx"));
        updateSlider();
      });
    });
  } else {
    modalPrev.style.display = "none";
    modalNext.style.display = "none";
    modalDots.innerHTML = "";
  }

  updateSlider();
}

// --- Open/Close Modal ---
function openModal(id) {
  const project = PROJECTS.find(p => p.id === id);
  if (!project) return;

  // Set metadata
  modalCategory.textContent = project.category;
  modalSubcategory.textContent = project.subcategory;
  modalTitle.textContent = project.title;
  modalDesc.textContent = project.details || project.description;
  modalClient.textContent = project.client;
  modalActionBtn.href = project.link;

  // Set Technologies
  modalTechTags.innerHTML = project.technologies.map(tech => `<span class="card-tag">${tech}</span>`).join("");

  // Set media slides
  initSlider(project.images, project.subcategory);

  // Show Modal
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Disable background scrolling
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = ""; // Re-enable scrolling
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  // Theme toggle
  themeToggleBtn.addEventListener("click", toggleTheme);

  // Header scroll shadow
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.padding = "0.5rem 0";
      header.style.boxShadow = "var(--glass-shadow)";
    } else {
      header.style.padding = "1rem 0";
      header.style.boxShadow = "none";
    }
  });

  // Mobile menu toggle
  mobileToggle.addEventListener("click", () => {
    mobileToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileToggle.classList.remove("active");
      navMenu.classList.remove("active");

      // Update active nav link representation
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Category Filter buttons
  categoryFiltersContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("filter-btn")) return;

    // Toggle active state representation
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");

    currentCategory = e.target.getAttribute("data-category");
    currentSubcategory = "all"; // Reset subcategory when main category changes

    renderSubcategoryFilters();
    renderPortfolio();
  });

  // Search input change
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderPortfolio();
  });

  // About tab toggles
  tabBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      e.target.classList.add("active");
      const targetTab = e.target.getAttribute("data-tab");
      document.getElementById(`tab-${targetTab}`).classList.add("active");
    });
  });

  // Close modal events
  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Modal slider navigation
  modalPrev.addEventListener("click", () => {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
    } else {
      currentSlideIndex = modalActiveImages.length - 1;
    }
    updateSlider();
  });

  modalNext.addEventListener("click", () => {
    if (currentSlideIndex < modalActiveImages.length - 1) {
      currentSlideIndex++;
    } else {
      currentSlideIndex = 0;
    }
    updateSlider();
  });

  // Contact Form Validation and Submission
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateContactForm()) {
      handleFormSubmit();
    }
  });

  // Remove error representation on field input
  const inputs = contactForm.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      const group = input.parentElement;
      group.classList.remove("has-error");
    });
    input.addEventListener("change", () => {
      const group = input.parentElement;
      group.classList.remove("has-error");
    });
  });

  // Reset form success view
  formResetBtn.addEventListener("click", () => {
    formSuccessOverlay.classList.remove("active");
    contactForm.style.display = "block";
    contactForm.reset();
  });
}

// --- Form Validation Helpers ---
function validateContactForm() {
  let isValid = true;

  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const serviceSelect = document.getElementById("contact-service");
  const messageInput = document.getElementById("contact-message");

  // Validate Name
  if (nameInput.value.trim() === "") {
    showError(nameInput, "name-error", "Name is required");
    isValid = false;
  } else {
    hideError(nameInput);
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailInput.value.trim() === "") {
    showError(emailInput, "email-error", "Email is required");
    isValid = false;
  } else if (!emailRegex.test(emailInput.value.trim())) {
    showError(emailInput, "email-error", "Please enter a valid email address");
    isValid = false;
  } else {
    hideError(emailInput);
  }

  // Validate Service
  if (serviceSelect.value === "") {
    showError(serviceSelect, "service-error", "Please select a service requirement");
    isValid = false;
  } else {
    hideError(serviceSelect);
  }

  // Validate Message
  if (messageInput.value.trim() === "") {
    showError(messageInput, "message-error", "Please write a brief description of your project");
    isValid = false;
  } else {
    hideError(messageInput);
  }

  return isValid;
}

function showError(input, errorId, message) {
  const group = input.parentElement;
  group.classList.add("has-error");
  document.getElementById(errorId).textContent = message;
}

function hideError(input) {
  const group = input.parentElement;
  group.classList.remove("has-error");
}

function handleFormSubmit() {
  const submitBtn = contactForm.querySelector(".btn-submit");
  const originalText = submitBtn.innerHTML;

  // Set loading representation
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    Sending...
    <svg class="loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width: 1.1rem; height: 1.1rem; animation: rotate 1s linear infinite; margin-left: 0.25rem;">
      <circle cx="12" cy="12" r="10" stroke-dasharray="30, 30"></circle>
    </svg>
  `;

  // Simulate API delay
  setTimeout(() => {
    // Revert button state
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    // Show Success state
    contactForm.style.display = "none";
    formSuccessOverlay.classList.add("active");
  }, 1200);
}

// CSS rotation animation for loading spinner
const style = document.createElement("style");
style.innerHTML = `
@keyframes rotate {
  100% { transform: rotate(360deg); }
}
.loading-spinner {
  display: inline-block;
}
`;
document.head.appendChild(style);
