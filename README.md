# BAC AI Front

Aplicație web pentru pregătirea examenului de Bacalaureat la Biologie, cu ajutorul inteligenței artificiale. Platforma generează automat subiecte realiste pe baza programei oficiale BAC, permite utilizatorilor să răspundă la întrebări direct în browser, iar răspunsurile sunt corectate semantic de un model AI, cu feedback și note.

## Funcționalități

- **Autentificare** – înregistrare și autentificare utilizatori (token JWT stocat local).
- **Generare subiecte cu AI** – subiecte generate automat, fie pe un capitol ales, fie aleatoriu, acoperind cele 22 de capitole din programa BAC de biologie.
- **Examen interactiv** – interfață cu mai multe tipuri de itemi (definiție, răspuns scurt, argumentare, enumerare, completare tabel, asociere, răspuns deschis), inclusiv suport pentru imagini de referință (lightbox).
- **Corectare automată** – răspunsurile sunt trimise spre evaluare semantică de către un model AI, cu feedback în limba română.
- **Urmărire progres** – dashboard cu istoricul examenelor, notele obținute și rezultatele detaliate.

## Tehnologii utilizate

### Frontend
- [React 19](https://react.dev/) – librărie UI
- [React Router v7](https://reactrouter.com/) – rutare client-side
- [Vite](https://vitejs.dev/) – build tool & dev server
- [Tailwind CSS v4](https://tailwindcss.com/) – stilizare (via `@tailwindcss/vite`)
- [Lucide React](https://lucide.dev/) – set de iconițe

### Comunicare cu backend
- API REST consumat prin `fetch`, cu autentificare bazată pe JWT (`src/api/client.js`)
- Configurabil prin variabila de mediu `VITE_API_BASE`

### Infrastructură / Tooling
- [Docker](https://www.docker.com/) & Docker Compose – containerizare pentru mediul de dezvoltare
- Node.js 24 (alpine)

## Structura proiectului

```
src/
├── api/            # Client API (autentificare, examene)
├── components/     # Componente reutilizabile (Navbar, ProtectedRoute, LoadingSpinner)
├── context/        # Context de autentificare (AuthContext)
├── pages/          # Pagini ale aplicației
│   ├── Landing.jsx     # Pagina principală
│   ├── Login.jsx       # Autentificare
│   ├── Register.jsx    # Înregistrare
│   ├── Dashboard.jsx   # Istoric și progres
│   ├── StartExam.jsx   # Selectare capitol / start examen
│   ├── ExamPage.jsx    # Susținere examen
│   └── ResultsPage.jsx # Rezultate și feedback
└── App.jsx         # Configurare rutare
```

## Rulare locală

### Cu npm

```bash
npm install
npm run dev
```

Aplicația va porni la `http://localhost:5173`.

### Cu Docker

```bash
docker-compose up
```

## Configurare

Creează un fișier `.env` pe baza `.env.example`:

```
VITE_API_BASE=http://localhost:8000
```

`VITE_API_BASE` reprezintă URL-ul către backend-ul API (necesar pentru autentificare, generare și corectare examene).

## Scripturi disponibile

| Comandă          | Descriere                              |
|-------------------|-----------------------------------------|
| `npm run dev`     | Pornește serverul de dezvoltare Vite    |
| `npm run build`   | Creează build-ul de producție           |
| `npm run preview` | Previzualizează build-ul de producție   |
