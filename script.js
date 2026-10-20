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


/* CONTACT FORM - FORMSPREE */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formStatus = document.getElementById("formStatus");
    const sendBtn = document.getElementById("sendBtn");
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
    themeIcon.className = isLight
      ? "fa-solid fa-moon"
      : "fa-solid fa-sun";

    themeText.textContent = isLight
      ? "Dark Mode"
      : "Light Mode";

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


document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (!menuToggle || !mainNav) return;

  const menuIcon = menuToggle.querySelector("i");

  function closeMenu() {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    if (menuIcon) {
      menuIcon.classList.remove("fa-xmark");
      menuIcon.classList.add("fa-bars");
    }
  }

  menuToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    if (menuIcon) {
      menuIcon.classList.toggle("fa-bars", !isOpen);
      menuIcon.classList.toggle("fa-xmark", isOpen);
    }
  });

  // Close the menu after selecting a navigation link
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Close the menu when returning to desktop width
  window.addEventListener("resize", function () {
    if (window.innerWidth > 600) {
      closeMenu();
    }
  });
});
