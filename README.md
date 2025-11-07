Film Atlas — A Full-Stack Movie Database Application

By Meka

Film Atlas is a full-stack movie discovery application built with Django REST Framework and a React frontend. It allows users to browse movies, filter by genre, view posters and ratings, create accounts, and save films to a personal watchlist. This project is a rebuilt and expanded version of my earlier IMDb-style movie site, redesigned to follow the recommended structure and technologies for the CS50W capstone.

Features
Movie Database

Full Movie model including title, description, release year, rating, and poster URL

Genre classification using a many-to-many relationship

Movie posters rendered in a responsive grid layout

Sorting and filtering by genre through API queries

Filtering

Dynamic filtering by genre on the frontend

Efficient response updates using React state and API parameters

Watchlist Functionality

Authenticated users may add or remove movies from their personal watchlist

Dedicated API endpoints for adding and removing watchlist entries

“In watchlist” status returned via a serializer field for accurate UI display

User Accounts

User registration and login using Django’s session-based authentication

Logout functionality and a /auth/me/ endpoint to retrieve the active user

CSRF-protected POST requests

Automatic Profile creation on registration (with display name, avatar URL, and bio fields)

Statistics Endpoint

/api/stats/ provides aggregated movie counts by genre

Useful for future analytics or administrative displays

Frontend

Built using React and Vite

Styled using Tailwind CSS (CDN version for rapid development)

Fully responsive movie card layout

Clean and simple user interface with genre filters and watchlist buttons

Distinctiveness and Complexity
Distinctiveness

Film Atlas is distinct from common CRUD-only web apps in the course. It is not a blog, task manager, notes app, or general tutorial copy. Instead, it is a custom-designed movie exploration platform with richer data relationships and a more interactive frontend experience.

Key distinctive elements include:

Movie posters, ratings, and genre classification

User watchlists tied to authentication

Dynamic, filterable movie grid

Tailored user experience rather than purely form-driven CRUD

Complexity

The project incorporates multiple layers of technical complexity:

Backend

Several interconnected models: Movie, Genre, Watchlist, Profile

Many-to-many and one-to-one relationships

Custom serializer fields to expose watchlist status

Custom DRF actions for add/remove operations

Session authentication and CSRF integration

Aggregation queries for statistics

Frontend

React state management across filtering, authentication, and watchlist interactions

Fetch API integration with session credentials

Dynamic rendering of movie cards and genres

Responsive grid using Tailwind utility classes

Overall, Film Atlas demonstrates strong understanding of backend design, API architecture, authentication, and modern frontend development.

Technology Stack

Backend

Python

Django

Django REST Framework

SQLite

Frontend

React

Vite

Tailwind CSS

Auth

Django session authentication

CSRF-protected POST requests

Installation and Usage
Backend Setup
