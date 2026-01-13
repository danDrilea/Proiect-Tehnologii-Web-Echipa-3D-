# Aplicatie de Feedback Continuu

Aceasta aplicatie web permite studentilor sa ofere feedback continuu in timpul cursurilor sau seminariilor, iar profesorilor sa vizualizeze acest feedback in timp real.

## Descriere

Proiectul este o aplicatie de tip Single Page Application (SPA) care faciliteaza interactiunea dintre profesor si studenti prin intermediul unui sistem de emoticoane.

**Functionalitati Cheie:**

- **Feedback in Timp Real**: Studentii reactioneaza live (Smile, Frown, Surprised, Confused).
- **Istoric Activitati**: Profesorii pot revedea activitatile trecute si feedback-ul primit.
- **Descriere si Durata**: Activitatile pot avea descrieri si o durata automata (incheiere automata dupa expirarea timpului).
- **Cod Unic**: Fiecare activitate are un cod generat pentru accesul studentilor.

## Tehnologii Utilizate

### Front-end (Client)

- **Vite + React**: Framework pentru interfata utilizator.
- **Tailwind CSS**: Framework CSS pentru stilizare.
- **Socket.IO Client**: Pentru comunicare in timp real.
- **Lucide React**: Set de iconite moderne.

### Back-end (Server)

- **Node.js + Express**: Server web si API REST.
- **SQLite**: Baza de date relationala (stocata in `database.sqlite`).
- **Sequelize**: ORM pentru interactiunea cu baza de date.
- **Socket.IO**: Pentru functionalitati in timp real.

## Instructiuni de Instalare si Rulare

Urmati acesti pasi pentru a porni aplicatia.

### 1. Pornire Server (Back-end)

Deschideti un terminal si navigati in folderul `server`:

```bash
cd server
npm install
npm start
```

Veti vedea mesajul:

- `Database synced`
- `Server is running on port 5000`

### 2. Pornire Client (Front-end)

Deschideti un al doilea terminal si navigati in folderul `client`:

```bash
cd client
npm install
npm run dev
```

Accesati link-ul afisat (ex: `http://localhost:5173`) in browser.

## Utilizare

### Pentru Profesor

1. **Login**: Introduceti un nume de utilizator (ex: "ProfesorPopescu") si alegeti rolul "Professor".
2. **Dashboard**:
   - **Creati Activitate**: Introduceti Numele, o Descriere (optional) si Durata in minute (optional).
   - **Istoric**: Vizualizati lista activitatilor anterioare in sectiunea din dreapta.
3. **In Timpul Activitatii**:
   - Distribuiti **Codul** studentilor.
   - Urmariti feedback-ul in timp real.
   - Daca ati setat o durata, activitatea se va incheia automat. Altfel, apasati "End Activity".

### Pentru Student

1. **Login**: Introduceti un nume (ex: "Ion") si alegeti rolul "Student".
2. **Participare**: Introduceti **Codul Activitatii**.
3. **Feedback**: Apasati pe emoticoane pentru a transmite reactia.
   - Daca activitatea a expirat, nu mai puteti trimite feedback.

## Structura Bazei de Date

Fisierul `database.sqlite` contine:

- **Activity**: `id`, `code`, `name`, `description`, `durationMinutes`, `professorId`, `isActive`, `createdAt`.
- **Feedback**: `id`, `activityCode`, `type`, `timestamp`.
