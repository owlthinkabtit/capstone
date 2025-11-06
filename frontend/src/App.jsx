import { useState, useEffect } from "react";

export default function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/items/")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched items:", data);
        setItems(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>Capstone Data Check ✅</h1>
      <h1 className="text-4xl font-bold text-purple-600">Tailwind is On</h1>
      <div className="h-12 w-full bg-red-500 mt-4" />

      {items.length === 0 ? (
        <p>No items found yet… (this is okay if your database is empty!)</p>
      ) : (
        <pre>{JSON.stringify(items, null, 2)}</pre>
      )}
    </div>
  );
}
