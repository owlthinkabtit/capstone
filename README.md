# Film Atlas — A Full-Stack Movie Database Application
**Author:** Jameka Haggins 

Film Atlas is a full-stack movie discovery application built with **Django REST Framework** and a **React frontend**.  
It allows users to browse movies, filter by genre, view posters and ratings, create accounts, and save films to a personal watchlist.  
This project rebuilds an earlier IMDb-style movie site to align with CS50W’s capstone requirements.

---

## Features

### Movie Database
- Title, description, release year, rating, and poster URL  
- Genre classification (many-to-many relationship)  
- Responsive grid of movie cards with poster images  
- Filtering and sorting via REST API queries

### Filtering
- Dynamic genre filters on the frontend  
- Real-time updates using React state and fetch API

### Watchlist System
- Authenticated users can add or remove movies from their watchlist  
- Custom API endpoints for watchlist actions  
- “In watchlist” field returned in serializers for UI feedback

### User Accounts
- Registration, login, and logout using Django sessions  
- CSRF-protected POST requests  
- `/api/auth/me/` endpoint to retrieve current user  
- Automatic profile creation with display name, avatar URL, and bio fields

### Statistics
- `/api/stats/` endpoint aggregates movie counts by genre  
- Useful for analytics or administrative dashboards

### Frontend
- Built with **React + Vite**  
- Styled using **Tailwind CSS**  
- Responsive movie grid and filter buttons  
- Clean, modern interface

---

## Distinctiveness and Complexity

### Distinctiveness
Film Atlas is not a basic CRUD demo. It’s a purpose-built movie exploration app featuring:
- User watchlists tied to authentication  
- Movie posters, ratings, and genres  
- A dynamic, interactive UI  
- Clear separation between backend API and frontend client

### Complexity

#### Backend
- Four interconnected models: `Movie`, `Genre`, `Watchlist`, `Profile`  
- Many-to-many and one-to-one relationships  
- Custom serializer fields and DRF actions  
- Session authentication and CSRF handling  
- Aggregation queries for genre statistics  

#### Frontend
- State management for filters, auth, and watchlist status  
- Fetch API with credentialed requests  
- Responsive layout using Tailwind utilities  
- Modular React components and clean hooks

---

## Technology Stack

| Layer | Technologies |
|:------|:--------------|
| **Backend** | Python · Django · Django REST Framework · SQLite |
| **Frontend** | React · Vite · Tailwind CSS |
| **Auth** | Django session authentication + CSRF protection |

---

## Installation and Usage

### Backend Setup
```bash
cd capstone
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Runs at http://127.0.0.1:8000/

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Runs at http://localhost:5173/
Will finalize once the project is finished.
