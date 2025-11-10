import { useEffect, useState } from "react";
import {
  fetchMe, registerUser, loginUser, logoutUser,
  getGenres, getMovies, addToWatchlist, removeFromWatchlist
} from "./api";

const API_OK = (x) => x; // tiny passthrough for readability

function AuthBar({ user, setUser }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (mode === "register") {
        const data = await registerUser(username, password, email);
        setUser(data.user);
      } else {
        const data = await loginUser(username, password);
        setUser(data.user);
      }
      setUsername(""); setPassword(""); setEmail("");
    } catch (err) {
      alert("Authentication failed. Check inputs and try again.");
      // optional: console.error(err);
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">Signed in as <b>{user.username}</b></span>
        <button
          className="px-3 py-1.5 text-sm border rounded hover:bg-gray-100"
          onClick={async () => { await logoutUser(); setUser(null); }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <select
        className="border rounded px-2 py-1.5 text-sm"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="login">Login</option>
        <option value="register">Register</option>
      </select>

      <input
        className="border rounded px-2 py-1.5 text-sm"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      {mode === "register" && (
        <input
          className="border rounded px-2 py-1.5 text-sm"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
      )}
      <input
        className="border rounded px-2 py-1.5 text-sm"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
      />
      <button className="px-3 py-1.5 text-sm border rounded bg-black text-white">
        {mode === "register" ? "Create account" : "Login"}
      </button>
    </form>
  );
}

function WatchButton({ movie, user, refreshMovies }) {
  if (!user) return null;
  const inList = movie.in_watchlist;

  const onClick = async () => {
    try {
      if (inList) await removeFromWatchlist(movie.id);
      else await addToWatchlist(movie.id);
      await refreshMovies();
    } catch {
      alert("Action failed. Are you logged in?");
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-sm rounded border ${inList ? "bg-amber-100" : "bg-white hover:bg-gray-100"}`}
      title={inList ? "Remove from Watchlist" : "Add to Watchlist"}
    >
      {inList ? "★ In Watchlist" : "☆ Add to Watchlist"}
    </button>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState("");

  // On load: get current user (also sets csrftoken cookie)
  useEffect(() => {
    fetchMe().then(API_OK).then(({ user }) => setUser(user)).catch(() => {});
  }, []);

  // Load genres once
  useEffect(() => { getGenres().then(setGenres); }, []);

  const refreshMovies = async () => {
    const data = await getMovies(activeGenre);
    setMovies(data);
  };

  // Load movies whenever filter changes
  useEffect(() => { refreshMovies(); }, [activeGenre]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Film Atlas</h1>
            <p className="text-sm text-gray-600">Your movie database with watchlists and accounts.</p>
          </div>
          <AuthBar user={user} setUser={setUser} />
        </header>

        {/* Genre Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setActiveGenre("")}
            className={`px-3 py-1.5 rounded-full border text-sm ${activeGenre === "" ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
          >
            All
          </button>
          {genres.map(g => (
            <button
              key={g.id}
              onClick={() => setActiveGenre(g.name)}
              className={`px-3 py-1.5 rounded-full border text-sm ${activeGenre === g.name ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Results summary */}
        <div className="text-sm text-gray-700 mb-3">
          <span className="font-medium">{movies.length}</span> result{movies.length === 1 ? "" : "s"}
        </div>

        {/* Movie Grid */}
        {movies.length === 0 ? (
          <div className="text-gray-500">No movies for this filter yet.</div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {movies.map(m => (
              <li key={m.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
                <div className="p-4 space-y-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-semibold leading-tight">
                      {m.title} {m.release_year ? <span className="text-gray-500 text-sm">({m.release_year})</span> : null}
                    </h2>
                    {m.rating != null && (
                      <div className="text-sm">
                        <span className="mr-1">⭐</span>
                        <span className="font-medium">{Number(m.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {m.genres.map(g => (
                      <span key={g.id} className="px-2 py-0.5 text-xs rounded-full border bg-gray-50">
                        {g.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <WatchButton movie={m} user={user} refreshMovies={refreshMovies} />
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
