
const API = "http://127.0.0.1:8000/api";

let CSRF = null;

async function getCsrf() {
  const res = await fetch(`${API}/auth/csrf/`, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to get CSRF: HTTP ${res.status}`);
  const data = await res.json();
  return data.csrfToken || "";
}

async function postJSON(url, data) {
  let token = await getCsrf();

  let res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
    body: JSON.stringify(data || {}),
  });

 
  if (res.status === 403) {
    token = await getCsrf(); 
    res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": token,
      },
      body: JSON.stringify(data || {}),
    });
  }

  if (!res.ok) {
    const text = await res.text();
    console.error("POST failed", res.status, { url, text });
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}
/* ---- Auth ---- */

export async function fetchMe() {
  const res = await fetch(`${API}/auth/me/`, { credentials: "include" });
  return res.json();
}

export async function initAuth() {
  await getCsrf();                 
  const { user } = await fetchMe(); 
  return user || null;
}

export function registerUser(username, password, email) {
  return postJSON(`${API}/auth/register/`, { username, password, email });
}
export function loginUser(username, password) {
  return postJSON(`${API}/auth/login/`, { username, password });
}
export function logoutUser() {
  return postJSON(`${API}/auth/logout/`);
}

/* ---- Data ---- */

export async function getGenres() {
  const r = await fetch(`${API}/genres/`);
  return r.json();
}
export async function getMovies(activeGenre) {
  const q = activeGenre ? `?genre=${encodeURIComponent(activeGenre)}` : "";
  const r = await fetch(`${API}/movies/${q}`, { credentials: "include" });
  return r.json();
}

export function addToWatchlist(id) {
  return postJSON(`${API}/movies/${id}/add_to_watchlist/`);
}
export function removeFromWatchlist(id) {
  return postJSON(`${API}/movies/${id}/remove_from_watchlist/`);
}
