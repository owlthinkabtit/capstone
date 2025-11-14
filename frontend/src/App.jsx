import { useEffect, useState } from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import {
  registerUser,
  loginUser,
  logoutUser,
  getGenres,
  getMovies,
  getMovie,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  initAuth,
} from "./Api";

function AuthBar({ user, setUser, onAuthChange }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let data;
      if (mode === "register") {
        data = await registerUser(username, password, email);
      } else {
        data = await loginUser(username, password);
      }
      setUser(data.user);
      setUsername("");
      setPassword("");
      setEmail("");
      await onAuthChange?.();
      navigate("/watchlist");
    } catch {
      alert("Authentication failed. Check inputs and try again.");
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">
          Signed in as <b>{user.username}</b>
        </span>
        <button
          className="px-3 py-1.5 text-sm border rounded hover:bg-gray-100"
          onClick={async () => {
            await logoutUser();
            setUser(null);
            await onAuthChange?.();
            navigate("/");
          }}
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

function WatchButton({ movie, user, authReady, refreshMovies }) {
  if (!authReady || !user) return null;
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
      className={`px-2 py-1 text-sm rounded border ${
        inList ? "bg-amber-100" : "bg-white hover:bg-gray-100"
      }`}
      title={inList ? "Remove from Watchlist" : "Add to Watchlist"}
    >
      {inList ? "★ In Watchlist" : "☆ Add to Watchlist"}
    </button>
  );
}

function MovieSkeletonGrid() {
  const placeholders = Array.from({ length: 6 });

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
      {placeholders.map((_, idx) => (
        <li
          key={`skeleton-${idx}`}
          className="bg-white border rounded-xl overflow-hidden shadow-sm"
        >
          <div className="aspect-[2/3] bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-1/5 animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WatchlistSkeletonGrid() {
  const placeholders = Array.from({ length: 4 });
  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
      {placeholders.map((_, idx) => (
        <li
          key={`wl-skel-${idx}`}
          className="bg-white border rounded-xl overflow-hidden shadow-sm"
        >
          <div className="aspect-[2/3] bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
          </div>
        </li>
      ))}
    </ul>
  );
}

function MoviesPage({ user, authReady }) {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getGenres().then(setGenres);
  }, []);

  const refreshMovies = async () => {
    setLoading(true);
    try {
      const data = await getMovies(activeGenre, query, sort);
      setMovies(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authReady) return;
    refreshMovies();
  }, [activeGenre, user, authReady, sort]);

  return (
    <>
      {/* Search + Sort */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          className="border rounded px-3 py-1.5 text-sm"
          placeholder="Search movies…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="border rounded px-3 py-1.5 text-sm"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort: Default</option>
          <option value="rating">Rating (high → low)</option>
          <option value="year">Release Year (newest → oldest)</option>
        </select>

        <button
          className="px-3 py-1.5 rounded border text-sm bg-white hover:bg-gray-100"
          onClick={refreshMovies}
          disabled={loading}
        >
          {loading ? "Loading…" : "Apply"}
        </button>
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
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
            key={`filter-${g.id}-${g.name}`}
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

      {/* Results summary */}
      <div className="text-sm text-gray-700 mb-3">
        {loading ? (
          <span>Loading movies…</span>
        ) : (
          <>
            <span className="font-medium">{movies.length}</span> result
            {movies.length === 1 ? "" : "s"}
          </>
        )}
      </div>

      {/* Movie Grid / Empty / Loading */}
      {loading ? (
        <MovieSkeletonGrid />
      ) : movies.length === 0 ? (
        <div className="text-gray-500">
          No movies match your current filters.
          <br />
          <span className="text-sm">
            Try clearing the search box or choosing a different genre.
          </span>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {movies.map((m) => (
            <li
              key={`movie-${m.id}`}
              className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow transition-transform hover:-translate-y-1"
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
              <div className="p-4 space-y-3">
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

                <div className="flex flex-wrap gap-2">
                  {m.genres
                    .filter((g) => g && g.id && g.name)
                    .map((g) => (
                      <span
                        key={`m${m.id}-g${g.id}-${g.name}`}
                        className="px-2 py-0.5 text-xs rounded-full border bg-gray-50"
                      >
                        {g.name}
                      </span>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to={`/movie/${m.id}`}
                    className="text-xs text-blue-600 underline hover:no-underline"
                  >
                    Details
                  </Link>
                  <WatchButton
                    movie={m}
                    user={user}
                    authReady={authReady}
                    refreshMovies={refreshMovies}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function WatchlistPage({ user, authReady }) {
  const [movies, setMovies] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getWatchlist();
      setMovies(data);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authReady || !user) {
      setMovies([]);
      return;
    }
    load();
  }, [user, authReady]);

  const handleRemove = async (id) => {
    try {
      setBusyId(id);
      await removeFromWatchlist(id);
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (!authReady) return null;

  if (!user) {
    return (
      <div className="text-gray-600">Please log in to view your watchlist.</div>
    );
  }

  if (loading) {
    return <WatchlistSkeletonGrid />;
  }

  if (movies.length === 0) {
    return (
      <div className="text-gray-600">
        Your watchlist is empty.
        <br />
        <span className="text-sm">
          Browse the Home page and add some favorites to see them here.
        </span>
      </div>
    );
  }

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {movies.map((m) => (
        <li
          key={`wl-${m.id}`}
          className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow transition-transform hover:-translate-y-1"
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
          <div className="p-4 space-y-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-semibold leading-tight">
                {m.title}{" "}
                {m.release_year ? (
                  <span className="text-gray-500 text-sm">
                    ({m.release_year})
                  </span>
                ) : null}
              </h2>
              <button
                onClick={() => handleRemove(m.id)}
                disabled={busyId === m.id}
                className={`px-2 py-1 text-xs rounded border ${
                  busyId === m.id
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
                aria-busy={busyId === m.id}
                title="Remove from Watchlist"
              >
                {busyId === m.id ? "Removing…" : "Remove"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {m.genres
                .filter((g) => g && g.id && g.name)
                .map((g) => (
                  <span
                    key={`wl-m${m.id}-g${g.id}-${g.name}`}
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
  );
}

function MovieDetailPage({ user, authReady }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getMovie(id)
      .then((data) => {
        if (!cancelled) {
          setMovie(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMovie(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleToggleWatchlist = async () => {
    if (!user) {
      alert("Please log in to use your watchlist.");
      return;
    }
    if (!movie) return;

    setBusy(true);
    try {
      if (movie.in_watchlist) {
        await removeFromWatchlist(movie.id);
      } else {
        await addToWatchlist(movie.id);
      }
      const fresh = await getMovie(movie.id);
      setMovie(fresh);
    } finally {
      setBusy(false);
    }
  };

  if (!authReady && loading) {
    return <div className="text-gray-600">Loading…</div>;
  }

  if (!loading && !movie) {
    return (
      <div className="space-y-4">
        <button
          className="text-sm text-gray-600 underline hover:no-underline hover:text-black transition-colors"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <div className="text-gray-600">Movie not found.</div>
      </div>
    );
  }

  if (!movie) {
    return <div className="text-gray-600">Loading…</div>;
  }

  return (
    <div className="space-y-4">
      <button
        className="text-sm text-gray-600 underline hover:no-underline hover:text-black transition-colors"
        onClick={() => navigate(-1)}
      >
        ← Back to results
      </button>

      <div className="max-w-3xl mx-auto bg-white border rounded-2xl shadow-sm p-4 md:p-6 space-y-4 fade-in">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="bg-gray-100 rounded-lg overflow-hidden max-h-80 w-full">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={`${movie.title} poster`}
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <div className="p-4 text-gray-500 text-sm text-center">
                  No poster available.
                </div>
              )}
            </div>
          </div>

          {/* Text column */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold">
                {movie.title}{" "}
                {movie.release_year ? (
                  <span className="text-gray-500 text-lg">
                    ({movie.release_year})
                  </span>
                ) : null}
              </h2>
              {movie.rating != null && (
                <div className="mt-1 text-sm">
                  <span className="mr-1">⭐</span>
                  <span className="font-medium">
                    {Number(movie.rating).toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres
                    .filter((g) => g && g.id && g.name)
                    .map((g) => (
                      <span
                        key={`detail-g${g.id}-${g.name}`}
                        className="px-2 py-0.5 text-xs rounded-full border bg-gray-50"
                      >
                        {g.name}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Description */}
            {movie.description && (
              <div>
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">
                  Description
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                  {movie.description}
                </p>
              </div>
            )}

            {/* Watchlist button */}
            <div>
              <button
                onClick={handleToggleWatchlist}
                disabled={busy}
                className={`mt-2 px-3 py-1.5 text-sm rounded border ${
                  movie.in_watchlist
                    ? "bg-amber-100"
                    : "bg-white hover:bg-gray-100"
                } ${busy ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {busy
                  ? "Updating…"
                  : movie.in_watchlist
                  ? "★ In Watchlist"
                  : "☆ Add to Watchlist"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    initAuth()
      .then(setUser)
      .finally(() => setAuthReady(true));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-baseline gap-4">
            <h1 className="text-3xl font-bold">Film Atlas</h1>
            <nav className="text-sm flex gap-3">
              <Link
                to="/"
                className={
                  location.pathname === "/"
                    ? "font-medium text-black underline transition-colors duration-150"
                    : "text-gray-600 underline hover:no-underline hover:text-black transition-colors duration-150"
                }
              >
                Home
              </Link>
              <Link
                to="/watchlist"
                className={
                  location.pathname.startsWith("/watchlist")
                    ? "font-medium text-black underline transition-colors duration:150"
                    : "text-gray-600 underline hover:no-underline hover:text-black transition-colors duration-150"
                }
              >
                My Watchlist
              </Link>
            </nav>
          </div>
          <AuthBar user={user} setUser={setUser} onAuthChange={() => {}} />
        </header>

        <Routes>
          <Route
            path="/"
            element={<MoviesPage user={user} authReady={authReady} />}
          />
          <Route
            path="/watchlist"
            element={<WatchlistPage user={user} authReady={authReady} />}
          />
          <Route
            path="/movie/:id"
            element={<MovieDetailPage user={user} authReady={authReady} />}
          />
        </Routes>
      </div>
    </main>
  );
}
