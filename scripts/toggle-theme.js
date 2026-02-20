// Javascript

// Buttons change theme
document.getElementById("toggle-theme").addEventListener('click', function() {
  const body = document.body;
  const button = document.getElementById("toggle-theme");

  body.classList.toggle("light-theme");
  body.classList.toggle("dark-theme");

  if (body.classList.contains("light-theme")) {
     button.className = "button-theme button-theme-light";
  } else {
      button.className = "button-theme button-theme-dark";
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const body = document.body;
  const button = document.getElementById("toggle-theme");

  body.classList.add("dark-theme");
  button.className = "button-theme button-theme-dark";
});

