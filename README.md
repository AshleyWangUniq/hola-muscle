# 💪 Hola Muscle

**Plan your workouts. Record your training. Build your own exercise library.**

Hola Muscle is a full-stack workout planning and tracking application built with React, TypeScript, Node.js, Express and MongoDB. Users can create reusable workout templates and record strength training sessions, including sets, repetitions and weights.

**[Try the live application](https://hola-muscle.vercel.app/)** · **[Source code](https://github.com/AshleyWangUniq/hola-muscle)**

## Why I built it

I wanted a flexible way to organise exercises and record my training. Building Hola Muscle has also been an opportunity to work through the full development process: designing the interface, modelling data, implementing APIs, connecting the frontend and backend, and deploying the application.

This is an actively developed personal project. Features and usability continue to evolve as I use the application and identify improvements.

## Features

- **Accounts:** Register, log in, update profile information and change passwords.
- **Exercise library:** Create, edit and delete exercises, with public and personal entries and filters for muscle groups and equipment.
- **Workout templates:** Build and manage reusable workouts with selected exercises and sets; filter workouts by muscle groups, equipment, goals and difficulty.
- **Training records:** Save strength training sessions with sets, repetitions, weights, comments and ratings; browse and delete previous records.
- **Session timer:** Start, pause and resume a timer while recording a workout.
- **Authentication:** Password hashing with bcrypt and JWT-based authentication for protected operations.

## Technology

| Layer | Technologies |
| --- | --- |
| Frontend | React, TypeScript, Vite, React Router, Bootstrap, Bootstrap Icons |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas, Mongoose |
| Authentication | bcrypt, JSON Web Tokens |
| Hosting | Vercel for the frontend; Render for the backend |

## Architecture

The React frontend communicates with an Express REST API. The backend uses Mongoose models to store users, exercises, workout templates and training records in MongoDB. React Context manages shared user, exercise and workout data on the frontend.

Protected requests send a JWT in the `Authorization: Bearer <token>` header. The frontend currently stores the token in localStorage.

| API base path | Purpose |
| --- | --- |
| `/api/users` | Registration, login and account management |
| `/api/exercises` | Exercise listing and management |
| `/api/workouts` | Workout template listing and management |
| `/api/strength-records` | Creating, listing and deleting training records |

## Repository structure

```text
hola-muscle/
├── frontend/
│   └── src/
│       ├── Pages/          # Application pages
│       ├── components/     # UI components
│       └── contexts/       # Shared application state
└── backend/
    └── src/
        ├── config/         # Database connection
        ├── controllers/    # Request handlers
        ├── middleware/     # Authentication middleware
        ├── models/         # Mongoose models
        ├── routes/         # API routes
        └── server.ts       # Express application entry point
```

## Run locally

### Prerequisites

- Node.js and npm compatible with the dependencies in each `package.json`.
- A MongoDB instance, either local or hosted on MongoDB Atlas.

### 1. Clone the repository

```bash
git clone https://github.com/AshleyWangUniq/hola-muscle.git
cd hola-muscle
```

### 2. Configure and start the backend

Create `backend/.env` with your own values:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/hola-muscle
JWT_SECRET=replace_with_a_long_random_secret
PORT=3000
FRONTEND_URL=http://localhost:5173
```

For Atlas, replace `MONGO_URI` with your connection string and configure database credentials and network access for your development environment. Keep real credentials out of version control.

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:3000` with the configuration above.

### 3. Configure and start the frontend

Create `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:3000
```

In a second terminal, from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. If Vite uses another port, update the backend's `FRONTEND_URL` to match.

### Available commands

Run these commands inside the corresponding directory:

| Directory | Command | Purpose |
| --- | --- | --- |
| `frontend` | `npm run dev` | Start the Vite development server |
| `frontend` | `npm run build` | Type-check and build the frontend |
| `frontend` | `npm run lint` | Run ESLint |
| `frontend` | `npm run preview` | Preview the frontend build locally |
| `backend` | `npm run dev` | Start the backend with automatic restarts |
| `backend` | `npm run build` | Compile TypeScript to `dist/` |
| `backend` | `npm start` | Run the compiled backend after building |

## Development highlights

- Modelled reusable workout templates separately from recorded training sessions.
- Connected authenticated frontend requests to backend routes and MongoDB data models.
- Worked through asynchronous state updates, form validation and exercise deletion behaviour.
- Configured deployment environment variables, CORS and MongoDB Atlas connectivity, and resolved TypeScript build issues.

## Next steps

- Add automated tests for core API and user workflows. The backend currently has no implemented test suite.
- Improve mobile usability, validation and error feedback.
- Add progress analytics and exercise images.
- Explore AI-assisted workout planning.

These are future development goals, rather than completed features.

## Author

**Ashley Wang** · [GitHub](https://github.com/AshleyWangUniq)
