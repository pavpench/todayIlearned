"use strict";

console.log("Hello world");

const shareButton = document.querySelector(".btn-large");
const form = document.querySelector(".fact-form");

const toggleForm = function () {
  form.classList.contains("hidden")
    ? form.classList.remove("hidden")
    : form.classList.add("hidden");
};

shareButton.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    shareButton.textContent = "Close";
  } else {
    shareButton.textContent = "Share a Fact";
  }
  toggleForm();
});
