# 🎬 Cornerstone Video 🎬
_Zachariah Magee, May 25, 2025_

Cornerstone video is a full-stack movie browser and recommendation app. It lets users brows, filter, and like movies from a large [wikipedia based dataset](https://github.com/prust/wikipedia-movie-data), and provides personalized recommendations based on user preferences.

## Features
- **Filtering** by genre and decade
- **Recommendations** based on liked movies (genre and actors)
- **Like System** with guest mode and persistent user accounts
- **Infinite Scroll** for browsing thousands of movies efficiently
- Responsive clean UI with dark/light mode support
- **Dockerized** for easy setup and preseeded MongoDb database

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB
- **Database**: MongoDB (local or containerized)
- **Tools**: Docker + Docker Compose


## Setup Instructions

1. **Clone the repository**
```sh
git clone https://github.com/zachariahmagee/cornerstone-video.git
cd cornerstone-video
```
2. **Run with Docker (Recommended)**
This project uses Docker and Docker Compose. It works on macOS, Linux, and Windows (with WSL2 or Docker Desktop).
Make sure [Docker and Docker Compose are installed](https://docs.docker.com/compose/install/)
MacOS users can also run `brew install --cask docker`

```sh
docker-compose up --build
```
Then you will be able to access:
-	**Frontend**: http://localhost:5173
-	**Backend**: http://localhost:8080/api/v1
-	**MongoDB**: localhost:27017


3. **Alternatively, Build, Seed, and Run without Docker**
You can run the project manually without Docker if you have [Node.js](https://nodejs.org/en) and [MongoDB](https://www.mongodb.com) installed locally. 

1. Install Dependencies
   In the root directory:
   ```sh
   npm install
   ```
   Then in the server and client directories:
   ```sh
    cd client
    npm install
    cd ../server
    npm install
   ```

2. Run MongoDB Locally
From within the server directory, create a mongodb-data folder if it doesn't already exist:
```sh
mkdir server/mongodb-data
```
Make sure MongoDB is running on your system. You can either:
- **MacOS/Linux** (installed via Homebrew or package manager):
```sh
mongod --dpath ./server/mongodb-data
```
- **Windows**
Start MongoDB using your prefered method (e.g., MongoDB, Windows Service, or manually):
```powershell
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath .\server\mongodb-data
```

3. Seed the Database
Once MongoDB is running, seed the movie data:
```sh
cd server
npm run seed
```
Now the database `cs-video` will be accessible at: `localhost:27017`

4. Run Both Projects
If you prefer to run both the frontend and backend together, the root project includes a convenience script using [concurrently](https://www.npmjs.com/package/concurrently)
```sh
npm run dev
```

This starts:
	•	the backend at http://localhost:8080
	•	the frontend at http://localhost:5173

Otherwise in two terminal tabs:
**Terminal 1**
```sh
cd server
npm run dev
```
**Terminal 2**
```sh
cd client
npm run dev
```


## API Overview

The backend exposes a RESTful API under /api/vi and itneracts with a MongoDB database `cs-video`.

### Movies
| Method | Endpoint        | Description                                                            |
|--------|------------------|------------------------------------------------------------------------|
| GET    | `/movies`        | Fetch movies with optional filters (`genre`, `decade`, `page`, `limit`) |
| GET    | `/movies/:id`    | Fetch a single movie by ID                                             |

### 👤 Users

| Method | Endpoint                          | Description                                                      |
|--------|-----------------------------------|------------------------------------------------------------------|
| POST   | `/users`                          | Register or log in a user using `name` and unique `email`        |
| GET    | `/users/:id`                      | Fetch a user’s information                                       |
| PUT    | `/users/:id/likes`                | Add or remove a liked movie (`movieId`, `liked` boolean)         |
| POST   | `/users/:id/likes/bulkUpdate`     | Sync a guest's liked movies to a logged-in user                  |
| GET    | `/users/:id/likes`                | Get a full list of liked movies for a user                       |
| GET    | `/users/:id/recommendations`      | Get personalized movie recommendations based on liked movies     |


## Current Limitations
- No real **authentication or account security**. User registration is simulated, and all data is stored without verification or password protection. 
- The API is also insecure. Use Bearer tokens for authentication.
- Recommendations require login. Right now, users must be logged in to receive recommendations. As a workaround, a “Guest” user is automatically registered on first load. Ideally, the server would support a recommendation endpoint that accepts a list of liked movie IDs, without requiring a persistent user.
- Recommendations lack filtering or sorting.
- Admin functionality (e.g., CRUD for movies) not implemented. All data is preseeded from JSON.
- No dedicated "Liked Movies" view (yet)

## Future Improvements
If I had more time, I'd love to:
- Add a “Back to Top” button once the user scrolls past a certain point.
- Support rating movies on a scale (e.g., 1–5 stars), or at least track both likes and dislikes.
- Make the infinite movie grid component reusable, like the carousel, and accept any data set.
- Add pagination and filters to the carousel (for curated or dynamic groupings).
- Build an admin dashboard for managing the movie catalog — including uploading, editing, and deleting entries.
- Cache recommendations per user or guest session to avoid excessive recomputation.
- Add unit and integration tests, especially for UI and state behavior (some API tests already exist under server/scripts).
- Implement full user accounts with sign-in, sign-out, and maybe even “friend” connections for collaborative recommendations.
- Finish extracting all of the client side api calls into api/movies and api/users
- Add Logging
- Fully flesh out keyboard navigation


## Resources Used
- Mozilla: https://developer.mozilla.org/en-us/docs/Web
- Abort Controller: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- URLSearchParams: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
- InfiniteScroll: https://neuralsorcerer.medium.com/mastering-infinite-scrolling-with-react-e8bcc48e5434
- MongoDB: https://www.mongodb.com/docs/
- React: https://react.dev
- The `poster-not-available` and `cs-video-logo`s were generated using ChatGPT
- Miles Griffith is a senior full stack engineer and a friend of mine, we did a video chat and discussed the challenge.

### Technical Challenge
This project is based on the technical challenge described below:

> Write a simple website that utilizes (wikipedia movie data)[https://github.com/prust/wikipedia-movie-data] to display a list of movies; create a filter for decade and a filter for genre. Optionally, you could add functionality for users to “like” particular movies (these “likes” can be stored client-side, server-side, or not stored). As a bonus, the website could recommend movies based on the genres and actors of “liked” films.

---

![Cornerstone Video Image](/client/public/cs-video-logo1x1.png)