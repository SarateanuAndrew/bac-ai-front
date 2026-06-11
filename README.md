# BAC AI Front

A web application for preparing for the Romanian Baccalaureate (BAC) exam in Biology, powered by artificial intelligence. The platform automatically generates realistic exam subjects based on the official curriculum, lets users answer questions directly in the browser, and uses an AI model to semantically grade the answers and provide feedback and scores.

## Features

- **Authentication** – user registration and login (JWT token stored locally).
- **AI-generated exams** – exams generated automatically, either for a chosen chapter or at random, covering all 22 chapters of the Biology BAC curriculum.
- **Interactive exam** – interface supporting multiple item types (definition, short answer, argumentation, enumeration, table completion, matching, open answer), including support for reference images (with lightbox view).
- **Automatic grading** – answers are sent for semantic evaluation by an AI model, with feedback provided in Romanian.
- **Progress tracking** – dashboard with exam history, scores, and detailed results.

## Technologies used

### Frontend
- [React 19](https://react.dev/) – UI library
- [React Router v7](https://reactrouter.com/) – client-side routing
- [Vite](https://vitejs.dev/) – build tool & dev server
- [Tailwind CSS v4](https://tailwindcss.com/) – styling (via `@tailwindcss/vite`)
- [Lucide React](https://lucide.dev/) – icon set

### Backend communication
- REST API consumed via `fetch`, with JWT-based authentication (`src/api/client.js`)
- Configurable through the `VITE_API_BASE` environment variable

### Infrastructure / Tooling
- [Docker](https://www.docker.com/) & Docker Compose – containerized development environment
- Node.js 24 (alpine)

## Project structure

```
src/
├── api/            # API client (authentication, exams)
├── components/     # Reusable components (Navbar, ProtectedRoute, LoadingSpinner)
├── context/        # Authentication context (AuthContext)
├── pages/          # Application pages
│   ├── Landing.jsx     # Landing page
│   ├── Login.jsx       # Login
│   ├── Register.jsx    # Registration
│   ├── Dashboard.jsx   # History and progress
│   ├── StartExam.jsx   # Chapter selection / start exam
│   ├── ExamPage.jsx    # Taking the exam
│   └── ResultsPage.jsx # Results and feedback
└── App.jsx         # Routing configuration
```

## Running locally

### With npm

```bash
npm install
npm run dev
```

The app will start at `http://localhost:5173`.

### With Docker

```bash
docker-compose up
```

## Configuration

Create a `.env` file based on `.env.example`:

```
VITE_API_BASE=http://localhost:8000
```

`VITE_API_BASE` is the URL of the backend API (required for authentication, exam generation, and grading).

## Available scripts

| Command           | Description                              |
|-------------------|-------------------------------------------|
| `npm run dev`     | Starts the Vite development server        |
| `npm run build`   | Creates a production build                 |
| `npm run preview` | Previews the production build              |
