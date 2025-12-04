# Film Atlas — A Full-Stack Movie Database Application  
**Author:** Jameka Haggins  

Film Atlas is a full-stack movie discovery platform built with a **Django REST Framework backend** and a **React + Vite frontend**.  
Users can browse films, filter by genre, sort by rating/year/title, search by title, view structured metadata, authenticate securely, and save movies to a personal watchlist that persists across sessions.

This project rebuilds an earlier IMDb-style assignment I created earlier in the course but re-engineers it to comply with **CS50W’s capstone requirements** by introducing a fully separated API backend, a dedicated SPA frontend, multi-page routing, user-specific state, and significantly more complex data relationships.

---

## Screenshots

### Home Page  
<img width="1873" height="1014" alt="Screenshot 2025-11-14 175336" src="https://github.com/user-attachments/assets/873aaeed-50b8-464d-9e13-b88966dc0167" />

### Watchlist Page  
<img width="1903" height="1005" alt="Screenshot 2025-11-14 175456" src="https://github.com/user-attachments/assets/66f5f29d-0818-4552-9471-919f95eb0696" />

### Movie Detail Page  
<img width="1853" height="1025" alt="Screenshot 2025-11-14 175752" src="https://github.com/user-attachments/assets/0f9debe2-a044-4924-b653-7166677c8a60" />

---

# Features

### Movie Database
- Title, description, release year, rating, runtime, director, and poster URL  
- Many-to-many genre relationships  
- Responsive movie grid  
- Dedicated movie detail page  
- Search by title  
- Sorting options (rating, year, alphabetical)

### Filtering & Sorting
- Genre filtering  
- Text search  
- Sorting on multiple fields  
- Real-time updates via React state + DRF query parameters  

### Watchlist System
- Add/remove movies via custom DRF actions  
- Watchlist page with user-specific data  
- Serializer computes `in_watchlist` dynamically  
- Loading states for visual feedback  

### User Accounts
- Session-based authentication  
- Register, login, logout  
- CSRF-protected POST requests  
- `/api/auth/me/` endpoint for frontend login persistence  

### Frontend
- React SPA  
- Vite dev environment  
- Tailwind CSS for styling  
- React Router multi-page navigation  
- Loading skeletons and smooth UX  

---

# Distinctiveness and Complexity

Film Atlas meets the **distinctiveness** requirement because it differs substantially in purpose, structure, and user experience from all previous course projects. The earlier assignments emphasize server-rendered templates or small AJAX components (such as Search and Wiki), transactional workflows (Commerce), communication systems (Mail), or social networking features (Network). Film Atlas, however, is built around **personal media exploration** with features such as genre filtering, title search, advanced sorting, multi-page navigation, personalized watchlists, and a full movie detail view. None of the earlier projects deal with complex media metadata, many-to-many genre relationships, personalized resource collections, or persistent watchlist state tied to authentication. The user workflow, data domain, and structural demands of this app are entirely separate from the themes of the earlier projects.

Furthermore, this project is distinct because it implements a **fully decoupled backend and frontend**, which is not required or demonstrated in earlier assignments. Django REST Framework powers all data access through a dedicated JSON API, while the entire UI is constructed as a standalone React single-page application running on a different development server. This requires careful handling of session cookies, CORS, CSRF tokens, and credentialed fetch requests to maintain authenticated state across the two environments. Earlier assignments relied mostly on Django templates or minimal dynamic behavior, whereas Film Atlas adopts a modern architecture closer to real-world full-stack development patterns.

The project also satisfies the **complexity** requirement through its multi-model backend and multi-layered frontend state management. The backend defines several interrelated models: `Movie` (with extensive metadata), `Genre` (connected through a many-to-many field), and `Watchlist` (linking users to selected films). Serializers implement nested data structures and compute fields like `in_watchlist`, which depends on the authenticated user and therefore requires contextual logic on a per-movie basis. DRF viewsets handle not only standard CRUD operations but also **custom actions**, query-parameter-based filtering, case-insensitive search across titles, sorting by multiple fields, and paginated results. These features go significantly beyond the “basic CRUD” examples covered earlier in the course.

On the frontend, React manages multiple state variables simultaneously: authenticated user state, genre filters, sorting mode, search queries, pagination state, movie listings, watchlist membership, and loading indicators. The application uses **React Router** to implement separate pages including the main listing, individual movie detail pages, and a user-specific watchlist. Each of these pages consumes the same API with different logic and presentation requirements. The watchlist page exposes only user-saved data; the detail page requires fetching a single movie by ID; the main page coordinates filtering, searching, sorting, and pagination together. Implementing skeleton loading screens, conditional UI states, and responsive layouts adds to the complexity of the frontend.

Finally, the need for **synchronized authentication** between the two servers increases both distinctiveness and complexity. All protected watchlist operations rely on Django sessions and CSRF protection, which must be handled manually in the React portion of the project. Ensuring that login persists, that cookies are included correctly in fetch requests, and that CSRF tokens are extracted and applied properly represents a layer of engineering not present in prior assignments.

Taken together, the architecture, features, interactions, and data models of Film Atlas demonstrate substantial originality compared to earlier coursework and introduce significant technical complexity appropriate for a CS50W capstone project.

---

# Files and Their Contents

Below is a full description of each file to which I contributed code and its role within the application.

## Backend (Django)

The backend includes a Django project configured to function exclusively as a REST API.  
`manage.py` serves as the command-line entry point for running the server, applying migrations, and performing administrative tasks.

The `server/settings.py` file defines project-wide configuration, including installed apps (Django, DRF, the `core` app), database settings, session behavior, static file configuration, CSRF and CORS rules necessary for cross-server development, and REST framework settings (such as pagination classes). The `server/urls.py` file defines the top-level URL structure, routing all admin and API traffic into the appropriate modules.

Inside the `core` application, `models.py` defines the relational structure of the database.  
The `Movie` model stores all film metadata such as title, description, director, release year, runtime, rating, and poster URL. It also contains a many-to-many field connecting movies to genres.  
The `Genre` model represents categories (e.g., comedy, action, drama) and supports a many-to-many relationship with movies.  
The `Watchlist` model defines a user-specific collection by linking users to movies they have saved.

The `serializers.py` file transforms these models into JSON for the frontend.  
`MovieSerializer` includes fields for metadata, nested genre information, and a dynamically computed `in_watchlist` field that checks whether the authenticated user has added the movie to their watchlist.  
`GenreSerializer` exposes genre data in a structured form.

In `views.py`, `MovieViewSet` controls how movies are accessed. It supports filtering by genre, searching by title, sorting results by rating/year/alphabetical order, and paginating output. It also includes custom actions (`add_to_watchlist` and `remove_from_watchlist`) that modify user-specific data.  
`GenreViewSet` returns genre lists for filtering.  
Authentication endpoints (`register`, `login_view`, `logout_view`, and `me`) implement session-based login and CSRF-protected requests.  
A dedicated `my_watchlist` view returns the authenticated user’s saved films.

`core/urls.py` ties all of these components together by defining RESTful routes for movies and genres and explicit paths for authentication and watchlist retrieval.

`core/pagination.py` defines a pagination class controlling how many movies are returned per page and how navigation between pages works.

The backend is completed by a `requirements.txt` file that lists Python dependencies.

---

## Frontend (React + Vite)

The frontend is a complete single-page application.  
`index.html` loads the app container.  
`main.jsx` initializes the React app and mounts it to the DOM.

The main logic lives in `App.jsx`, which defines the structure and state of the application.  
It manages authenticated user information, filters, the current search query, selected sorting options, the current page for pagination, the list of movies, and the status of watchlist actions.  
The file defines multiple components:

- `AuthBar` handles registration, login, logout, and displays user status.
- `MoviesPage` shows the main catalog with filtering, sorting, searching, and pagination.
- `WatchlistPage` shows user-specific saved films.
- `MovieDetailPage` presents detailed metadata for a single movie.
- `WatchButton` enables users to toggle a movie's watchlist status.

Routing between these pages is implemented with **React Router**, allowing the app to function like a multi-page site while remaining a single-page application.

`api.js` contains all networking logic.  
It defines functions for performing authenticated requests, retrieving movies and genres, adding and removing watchlist entries, fetching the current user session, and handling CSRF credentials. This modular structure enables the rest of the frontend to rely on clean abstractions for data access.

`index.css` loads Tailwind and defines global styling rules.  
`vite.config.js` configures the Vite development server.  
`package.json` defines frontend dependencies and scripts.

Together, these files form the complete client-side interface of the application.

---

# Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | Python · Django · Django REST Framework · SQLite |
| **Frontend** | React · Vite · Tailwind CSS |
| **Authentication** | Django Sessions + CSRF Protection |
| **Routing** | React Router |
| **Styling** | Tailwind CSS |

---

# Installation and Usage

## Backend Setup
```bash
cd capstone
python -m venv venv
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Backend run at: http://127.0.01:8000/

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173/

---

# Future Enhancements
- Reviews and star ratings 
- External metadata from TMDB/OMDb
- User profile editing
- Dark mode
- Trailer embeds or galleries 

---

# CS50W
This project was created as the capstone for Harvard's **CS50 Web Programming with Python and Javascript**.