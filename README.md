# Film Atlas — A Full-Stack Movie Database Application
**Author:** Jameka Haggins  

Film Atlas is a full-stack movie discovery application built with **Django REST Framework** and a **React frontend**.  
It allows users to browse movies, filter by genre and rating, search by title, view posters and details, create accounts, and save films to a personal watchlist.  
This project rebuilds an earlier IMDb-style movie site to align with **CS50W’s capstone requirements** while improving design, performance, and user experience.

---

## Screenshots

### Home Page
<img width="1873" height="1014" alt="Screenshot 2025-11-14 175336" src="https://github.com/user-attachments/assets/873aaeed-50b8-464d-9e13-b88966dc0167" />

### Watchlist Page
<img width="1903" height="1005" alt="Screenshot 2025-11-14 175456" src="https://github.com/user-attachments/assets/66f5f29d-0818-4552-9471-919f95eb0696" />

### Movie Detail Page
<img width="1853" height="1025" alt="Screenshot 2025-11-14 175752" src="https://github.com/user-attachments/assets/0f9debe2-a044-4924-b653-7166677c8a60" />

---


## Features

### Movie Database
- Title, description, release year, rating, runtime, director, and poster URL  
- Genre classification with many-to-many relationship  
- Responsive grid of movie cards  
- New movie detail page with condensed, readable layout  
- Search bar for filtering by title  
- Sort options (rating, year, default, alphabetical order)

### Filtering & Sorting
- Dynamic genre filters  
- Title search filtering  
- Sort by rating, alphabetical order, or year  
- All queries powered by Django REST Framework  
- Real-time updates using React state and fetch API

### Watchlist System
- Authenticated users can add/remove movies  
- Custom DRF actions for watchlist endpoints  
  - `/add_to_watchlist/`  
  - `/remove_from_watchlist/`  
- Watchlist page showing only saved titles  
- “In watchlist” field included in movie serializer for UI feedback  
- Responsive Remove buttons with loading states  

### User Accounts
- User registration, login, and logout  
- Django session authentication  
- CSRF-protected POST requests  
- `/api/auth/me/` to retrieve current user  
- Auto-login on registration  
- Secure, cookie-based session handling

### Frontend
- Built with **React + Vite**  
- Styled using **Tailwind CSS**  
- Loading skeletons for slower connections  
- Clean, polished UI  
- Dynamic routing with React Router (`/`, `/watchlist`, `/movie/:id`)  

---

## Distinctiveness and Complexity

### Distinctiveness
Film Atlas goes beyond a basic CRUD application.  
It includes:

- A real authentication system  
- Personalized watchlists  
- Movie detail pages  
- Search + filtering + sorting  
- API-based communication between frontend and backend  
- Enhanced UX with skeletons, fade animations, and responsive layouts  
- Clearly separated backend (API) and frontend (SPA) architecture  

### Complexity

#### Backend Complexity
- Four models:
  - `Movie`
  - `Genre`
  - `Watchlist`
- Many-to-many (movies ↔ genres)  
- One-to-many (user ↔ watchlist entries)  
- Custom serializer methods  
- DRF ViewSets with custom actions  
- Session authentication + CSRF handling  
- Aggregation queries for genre statistics  
- Slug-safe URL patterns  

#### Frontend Complexity
- Multiple React components  
- State management for:
  - authentication  
  - filtering  
  - searching  
  - sorting  
  - watchlist status  
  - loading states  
- Modular API helper file  
- React Router for multi-page SPA functionality  
- Tailwind-powered responsive design  
- Skeleton loading screens and polished transitions  

---

## Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Backend** | Python · Django · Django REST Framework · SQLite |
| **Frontend** | React · Vite · Tailwind CSS |
| **Authentication** | Django Sessions + CSRF Protection |
| **Routing** | React Router |
| **Styling** | Tailwind CSS |

---

## Installation and Usage

### Backend Setup
```bash
cd capstone
python -m venv venv
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Runs at: http://127.0.0.1:8000/

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Runs at: http://localhost:5173/

---
## Future Enchancements 
- Movie reviews or star ratings 
- Connect to TMDB/OMDb API for external metadata
- Pagination for large movie lists
- Dark Mode
- User profile editing
- Favorites beyond the watchlist
- Trailer embeds or media gallery

---

## CS50W
This project was created as the capstone for Havard's CS50W Web Programming with Python and JavaScript.
