import "./style.css";
import { useEffect, useState } from "react";
import supabase from "./supabase";

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

// function Counter() {
//   let [count, setCount] = useState(0);
//   return (
//     <div>
//       <span style={{ fontSize: "40px" }}>{count}</span>
//       <button
//         className="btn btn-large"
//         onClick={() => setCount((current) => current + 1)}>
//         +1
//       </button>
//     </div>
//   );
// }

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);

  useEffect(function () {
    async function getFacts() {
      const { data: facts, error } = await supabase.from("facts").select("*");
      setFacts(facts);
    }
    getFacts();
  }, []);

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      <main className="main">
        <CategoryFilter />
        <FactList facts={facts} />
      </main>
    </>
  );
}

function Header({ showForm, setShowForm }) {
  const appTitle = "Today I learned";

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="today I learned logo" />
        <h1>{appTitle}</h1>
      </div>
      <button
        className="btn btn-large"
        onClick={() => {
          setShowForm((currentState) => !currentState);
        }}>
        {showForm ? "Close" : "Share a Fact"}
      </button>
    </header>
  );
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const textLength = text.length;

  /** Check if input is valid URL */

  function isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
      console.log(url);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(text, source, category);

    //2. Check if data is valid
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      console.log("there is data");
      //3. Create a new fact object
      const newFact = {
        id: Math.round(Math.random() * 100),
        text,
        source,
        category: category,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createdIn: new Date().getFullYear(),
      };
      //4. Add new fact to the UI
      setFacts((facts) => {
        return [newFact, ...facts];
      });
      //5. Reset input fields
      setText("");
      setSource("");
      setCategory("");
      //6. Close the form
      setShowForm("");
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source"
        onChange={(e) => {
          return setSource(e.target.value);
        }}
      />
      <select
        value={category}
        name=""
        id=""
        onChange={(e) => setCategory(e.target.value)}>
        <option value="">Choose category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large">Post</button>
    </form>
  );
}

function CategoryFilter() {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categories">All</button>
        </li>
        {CATEGORIES.map((cat) => {
          return (
            <li key={cat.name} className="category">
              <button
                className="btn btn-category"
                style={{ backgroundColor: cat.color }}>
                {cat.name}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function FactList({ facts }) {
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} />
        ))}
      </ul>
      <p>There are {facts.length} in the database</p>
    </section>
  );
}

function Fact({ fact }) {
  return (
    <>
      <li className="fact">
        <p>
          {fact.text}
          <a href={fact.source} className="source" target="_blank">
            (Source)
          </a>
        </p>
        <span
          className="tag"
          style={{
            backgroundColor: CATEGORIES.find(
              (cat) => cat.name === fact.category
            ).color,
          }}>
          {fact.category}
        </span>
        <div className="vote-buttons">
          <button>
            👍
            <strong>{fact.votesInteresting}</strong>
          </button>
          <button>
            🤯
            <strong>{fact.votesMindblowing}</strong>
          </button>
          <button>
            ⛔️
            <strong>{fact.votesFalse}</strong>
          </button>
        </div>
      </li>
    </>
  );
}

export default App;
