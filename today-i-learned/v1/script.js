"use strict";

const shareButton = document.querySelector(".btn-large");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".facts-list");

/**
 * Facts list element reset
 */
factsList.innerHTML = "";

/**
 * Load data from Supabase
 */
const loadFacts = async function () {
  const res = await fetch(
    "https://kckmehlkypmfrtwgvynr.supabase.co/rest/v1/facts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtja21laGxreXBtZnJ0d2d2eW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4NjA5ODAsImV4cCI6MjAxNzQzNjk4MH0.SbTPoooWo8BHmnFmR16K3xfccmmJJ29JHcV9f0hxTaE",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtja21laGxreXBtZnJ0d2d2eW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4NjA5ODAsImV4cCI6MjAxNzQzNjk4MH0.SbTPoooWo8BHmnFmR16K3xfccmmJJ29JHcV9f0hxTaE",
      },
    }
  );
  const data = await res.json();

  //Filter fetched data
  // const filteredData = data.filter((fact) => {
  //   return fact.category === "society";
  // });
  createFactsList(data);
};

loadFacts();
/**
 * Share fact form visibility toggle
 */

const toggleForm = function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    shareButton.textContent = "Close";
  } else {
    form.classList.add("hidden");
    shareButton.textContent = "Share a Fact";
  }
};

/**
 * Share fact button handler
 */
shareButton.addEventListener("click", function () {
  toggleForm();
});

const calcFactAge = function (year) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;

  if (age >= 0) return age;
  else return "Impossible year";
};

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

/**
 * Render facts List element
 */

// createFactsList(initialFacts);
function createFactsList(dataArray) {
  const htmlArr = dataArray.map(
    (fact) => ` <li class="fact">
  <p>
    ${fact.text}
    <a
      href='${fact.source}'
      class="source"
      target="_blank">
      (Source)
    </a>
  </p>
  <span class="tag" style="background-color: ${
    CATEGORIES.find((cat) => cat.name === fact.category).color
  }">
    ${fact.category}
  </span>`
  );

  const html = htmlArr.join("");

  factsList.insertAdjacentHTML("afterbegin", html);
}
