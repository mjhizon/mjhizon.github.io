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
