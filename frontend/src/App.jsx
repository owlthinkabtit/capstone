import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000/api";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState("");

  useEffect(() => {
    fetch(`${API}/genres/`)
      .then((r) => r.json())
      .then(setGenres)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const q = activeGenre ? `?genre=${encodeURIComponent(activeGenre)}` : "";
    fetch(`${API}/movies/${q}`)
      .then((r) => r.json())
      .then(setMovies)
      .catch(console.error);
  }, [activeGenre]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Film Atlas</h1>
            <p className="text-sm text-gray-600">
              Your capstone movie database, powered by Django + React.
            </p>
          </div>
          {/* simple count */}
          <div className="text-sm text-gray-700">
            <span className="font-medium">{movies.length}</span> result
            {movies.length === 1 ? "" : "s"}
          </div>
        </header>

        {/* Genre Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setActiveGenre("")}
            className={`px-3 py-1.5 rounded-full border text-sm ${
              activeGenre === ""
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGenre(g.name)}
              className={`px-3 py-1.5 rounded-full border text-sm ${
                activeGenre === g.name
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Movie Grid */}
        {movies.length === 0 ? (
          <div className="text-gray-500">No movies for this filter yet.</div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {movies.map((m) => (
              <li
                key={m.id}
                className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-[2/3] bg-gray-100">
                  {m.poster_url ? (
                    <img
                      src={m.poster_url}
                      alt={`${m.title} poster`}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : null}
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-semibold leading-tight">
                      {m.title}{" "}
                      {m.release_year ? (
                        <span className="text-gray-500 text-sm">
                          ({m.release_year})
                        </span>
                      ) : null}
                    </h2>
                    {m.rating != null && (
                      <div className="text-sm">
                        <span className="mr-1">⭐</span>
                        <span className="font-medium">
                          {Number(m.rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {m.genres.map((g) => (
                      <span
                        key={g.id}
                        className="px-2 py-0.5 text-xs rounded-full border bg-gray-50"
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
