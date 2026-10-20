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