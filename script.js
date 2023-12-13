"use strict";

console.log("Hello world");

const shareButton = document.querySelector(".btn-large");
const form = document.querySelector(".fact-form");

shareButton.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    shareButton.textContent = "Close";
  } else {
    form.classList.add("hidden");
    shareButton.textContent = "Share a Fact";
  }
});
