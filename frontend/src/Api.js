const API = "http://127.0.0.1:8000/api";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
  return "";
}

async function ensureCsrf() {
  await fetch(`${API}/auth/me/`, { credentials: "include" });
}

export async function fetchMe() {
  const res = await fetch(`${API}/auth/me/`, { credentials: "include" });
  return res.json();
}

export async function initAuth() {
  await ensureCsrf();
  const res = await fetch(`${API}/auth/me/`, { credentials: "include" });
  const data = await res.json();
  return data.user || null;
}

export async function postJSON(url, data) {
  let token = getCookie("csrftoken");
  if (!token) {
    await ensureCsrf();
    token = getCookie("csrftoken");
  }
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token || "",
    },
    body: JSON.stringify(data || {}),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
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

/** ---- Data API ---- */
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
