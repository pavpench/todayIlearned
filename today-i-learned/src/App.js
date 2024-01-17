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

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCategory] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query
          .order("votesInteresting", { ascending: false })
          .limit(1000);

        if (!error) setFacts(facts);
        else alert("There was a problem getting data");
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      <main className="main">
        <CategoryFilter setCategory={setCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
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
  const [isUploading, setIsUploading] = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(text, source, category);

    //2. Check if data is valid
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      console.log("there is data");
      //3. Create a new fact object
      // const newFact = {
      //   id: Math.round(Math.random() * 100),
      //   text,
      //   source,
      //   category: category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      //3. Upload fact to Supabase and receive the new fact object
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      //4. Add new fact to the UI
      if (!error)
        setFacts((facts) => {
          return [newFact[0], ...facts];
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
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source"
        onChange={(e) => {
          return setSource(e.target.value);
        }}
        disabled={isUploading}
      />
      <select
        value={category}
        name=""
        id=""
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}>
        <option value="">Choose category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCategory("all")}>
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => {
          return (
            <li key={cat.name} className="category">
              <button
                className="btn btn-category"
                style={{ backgroundColor: cat.color }}
                onClick={() => setCategory(cat.name)}>
                {cat.name}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className="message">
        No facts for this category yet. Create the first one ! :)
      </p>
    );
  }

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} in the database</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
    setIsUpdating(false);
  }

  return (
    <>
      <li className="fact">
        <p>
          {isDisputed ? <span className="disputed">[DISPUTED]</span> : null}
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
          <button
            onClick={() => handleVote("votesInteresting")}
            disabled={isUpdating}>
            👍
            <strong>{fact.votesInteresting}</strong>
          </button>
          <button onClick={() => handleVote("votesMindblowing")}>
            🤯
            <strong>{fact.votesMindblowing}</strong>
          </button>
          <button onClick={() => handleVote("votesFalse")}>
            ⛔️
            <strong>{fact.votesFalse}</strong>
          </button>
        </div>
      </li>
    </>
  );
}

export default App;
