
console.log("Welcome to Joshua's Portfolio!");

/* =========================
   INTERACTIVE SKILLS
========================= */

document.addEventListener("DOMContentLoaded", function () {
  const skills = document.querySelectorAll("#skills .skill");

  console.log("Skills found:", skills.length);

  skills.forEach(function (skill) {
    skill.setAttribute("tabindex", "0");
    skill.setAttribute("role", "button");
    skill.setAttribute("aria-expanded", "false");

    skill.addEventListener("click", function (event) {
      event.stopPropagation();

      const wasActive = skill.classList.contains("active");

      // Close every skill first
      skills.forEach(function (item) {
        item.classList.remove("active");
        item.setAttribute("aria-expanded", "false");
      });

      // Open the clicked skill if it was closed
      if (!wasActive) {
        skill.classList.add("active");
        skill.setAttribute("aria-expanded", "true");
      }

      console.log("Clicked skill:", skill.textContent.trim());
    });

    skill.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        skill.click();
      }
    });
  });

  // Close descriptions when clicking outside the skills
  document.addEventListener("click", function (event) {
    if (!event.target.closest("#skills .skill")) {
      skills.forEach(function (skill) {
        skill.classList.remove("active");
        skill.setAttribute("aria-expanded", "false");
      });
    }
  });
});


/* =========================
   CONTACT FORM - FORMSPREE
========================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formStatus = document.getElementById("formStatus");
    const sendBtn = document.getElementById("sendBtn");

    if (!formStatus || !sendBtn) {
      console.error("Contact form status or send button is missing.");
      return;
    }

    const originalButtonText = sendBtn.innerHTML;

    formStatus.textContent = "Sending your message...";
    sendBtn.disabled = true;
    sendBtn.innerHTML = "Sending...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        contactForm.reset();
        formStatus.textContent =
          "Message sent successfully! Thank you for contacting me.";
        formStatus.style.color = "#8BC49A";
      } else {
        formStatus.textContent =
          "Unable to send your message. Please try again.";
        formStatus.style.color = "#E88A8A";
      }
    } catch (error) {
      console.error("Contact form error:", error);

      formStatus.textContent =
        "Connection error. Please check your internet and try again.";
      formStatus.style.color = "#E88A8A";
    } finally {
      sendBtn.disabled = false;
      sendBtn.innerHTML = originalButtonText;
    }
  });
}


/* =========================
   LIGHT / DARK MODE
========================= */

document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");

  if (!themeToggle) return;

  const themeIcon = themeToggle.querySelector("i");
  const themeText = themeToggle.querySelector("span");

  // Load the saved theme, or use dark mode by default
  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("portfolio-theme") || "dark";
  } catch (error) {
    savedTheme = "dark";
  }

  function applyTheme(theme) {
    const isLight = theme === "light";

    document.body.setAttribute("data-theme", theme);

    // Update the toggle icon and label
    if (themeIcon) {
      themeIcon.className = isLight
        ? "fa-solid fa-moon"
        : "fa-solid fa-sun";
    }

    if (themeText) {
      themeText.textContent = isLight
        ? "Dark Mode"
        : "Light Mode";
    }

    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode"
    );

    // Save the selected theme
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch (error) {
      // Theme switching still works if storage is unavailable
    }
  }

  // Apply the initial theme
  applyTheme(savedTheme === "light" ? "light" : "dark");

  // Switch themes when clicked
  themeToggle.addEventListener("click", function () {
    const currentTheme = document.body.getAttribute("data-theme");

    applyTheme(currentTheme === "light" ? "dark" : "light");
  });
});


/* ==========================================
   AURA MOUSE POINTER + MOTION TRAIL
========================================== */

function initAuraCursor() {
  // Prevent duplicate cursor elements
  if (window.__auraCursorInitialized) return;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  );

  // Keep the normal cursor on touch-only devices
  if (!finePointer.matches) {
    console.log("Aura cursor skipped: no fine pointer detected.");
    return;
  }

  // Remove any old custom cursor elements
  document.querySelectorAll(
    ".aura-cursor, .tech-crosshair"
  ).forEach(function (element) {
    element.remove();
  });

  const root = document.documentElement;

  // Create a cursor element
  function createCursorPart(className) {
    const element = document.createElement("div");

    element.className = "aura-cursor " + className;
    element.setAttribute("aria-hidden", "true");

    document.body.appendChild(element);

    return element;
  }

  const dot = createCursorPart("aura-cursor__dot");
  const aura = createCursorPart("aura-cursor__aura");

  const trailOne = createCursorPart(
    "aura-cursor__trail aura-cursor__trail--one"
  );

  const trailTwo = createCursorPart(
    "aura-cursor__trail aura-cursor__trail--two"
  );

  const trailThree = createCursorPart(
    "aura-cursor__trail aura-cursor__trail--three"
  );

  const parts = [dot, aura, trailOne, trailTwo, trailThree];

  window.__auraCursorInitialized = true;
  root.classList.add("has-aura-cursor");

  let targetX = -100;
  let targetY = -100;
  let currentX = -100;
  let currentY = -100;

  const trails = [
    { element: trailOne, x: -100, y: -100, speed: 0.30 },
    { element: trailTwo, x: -100, y: -100, speed: 0.19 },
    { element: trailThree, x: -100, y: -100, speed: 0.11 }
  ];

  let animationFrame = null;
  let pointerInside = false;

  function place(element, x, y) {
    element.style.transform =
      `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }

  function animate() {
    currentX += (targetX - currentX) * 0.42;
    currentY += (targetY - currentY) * 0.42;

    // The dot follows the mouse directly
    place(dot, targetX, targetY);

    // The aura follows smoothly
    place(aura, currentX, currentY);

    // Each trail particle follows at a different speed
    trails.forEach(function (trail) {
      trail.x += (currentX - trail.x) * trail.speed;
      trail.y += (currentY - trail.y) * trail.speed;

      place(trail.element, trail.x, trail.y);
    });

    const distance =
      Math.abs(targetX - currentX) +
      Math.abs(targetY - currentY);

    if (distance > 0.15) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      animationFrame = null;
    }
  }

  function startAnimation() {
    if (animationFrame === null) {
      animationFrame = requestAnimationFrame(animate);
    }
  }

  function showCursor() {
    if (!pointerInside) {
      pointerInside = true;

      parts.forEach(function (element) {
        element.classList.add("is-visible");
      });
    }
  }

  function hideCursor() {
    pointerInside = false;

    parts.forEach(function (element) {
      element.classList.remove("is-visible");
    });

    dot.classList.remove("is-hovering", "is-clicking");
    aura.classList.remove("is-hovering", "is-clicking");
  }

  // Track mouse movement
  document.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch") return;

    targetX = event.clientX;
    targetY = event.clientY;

    showCursor();
    startAnimation();
  });

  // Elements that trigger the hover effect
  const interactiveSelector = [
    "a",
    "button",
    "[role='button']",
    ".skill",
    ".project-card",
    "input",
    "textarea",
    "select",
    "label"
  ].join(",");

  document.addEventListener("pointerover", function (event) {
    if (event.pointerType === "touch") return;

    if (
      event.target instanceof Element &&
      event.target.closest(interactiveSelector)
    ) {
      aura.classList.add("is-hovering");
      dot.classList.add("is-hovering");
    }
  });

  document.addEventListener("pointerout", function (event) {
    const next = event.relatedTarget;

    if (
      !(next instanceof Element) ||
      !next.closest(interactiveSelector)
    ) {
      aura.classList.remove("is-hovering");
      dot.classList.remove("is-hovering");
    }
  });

  // Click pulse
  document.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "touch") return;

    aura.classList.add("is-clicking");
    dot.classList.add("is-clicking");
  });

  document.addEventListener("pointerup", function () {
    aura.classList.remove("is-clicking");
    dot.classList.remove("is-clicking");
  });

  // Hide when the pointer leaves the document
  document.addEventListener("pointerleave", function (event) {
    if (event.target === document) {
      hideCursor();
    }
  });

  // Hide when the browser window loses focus
  window.addEventListener("blur", hideCursor);

  window.addEventListener("focus", function () {
    hideCursor();
  });

  // Remove custom cursor if pointer capability changes
  function handlePointerCapabilityChange() {
    if (!finePointer.matches) {
      hideCursor();

      root.classList.remove("has-aura-cursor");

      parts.forEach(function (element) {
        element.remove();
      });

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      window.__auraCursorInitialized = false;
    }
  }

  if (finePointer.addEventListener) {
    finePointer.addEventListener(
      "change",
      handlePointerCapabilityChange
    );
  } else {
    finePointer.addListener(handlePointerCapabilityChange);
  }

  console.log("Aura cursor initialized:", parts.length, "elements");
}

// Run only after the body exists
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAuraCursor, {
    once: true
  });
} else {
  initAuraCursor();
}

