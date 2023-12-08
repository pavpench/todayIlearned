"use strict";

console.log("Hello world");

const shareButton = document.querySelector(".btn-large");
const form = document.querySelector(".fact-form");

shareButton.addEventListener("click", function () {
  form.classList.contains("hidden")
    ? form.classList.remove("hidden")
    : form.classList.add("hidden");
});
