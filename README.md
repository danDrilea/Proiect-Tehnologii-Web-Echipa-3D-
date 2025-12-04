# SPECIFICĂȚII DETALIATE, PLAN DE PROIECT, PREZENȚA UNUI PROIECT ÎN GIT - 16.11.2025

## Specificatii detaliate

### Workflow
1. Ai o pagina unde alegi daca esti **profesor** sau **student**  
2. Daca esti profesor generezi automat un cod de activitate, daca esti student ai optiunea sa introduci codul unei activitati  

### Profesor
- Ai partea superioara a aplicatiei unde se desfasoara activitatea  
- Dedesubt un log anonim unde poti vedea **data unei reactii** si **tipul de reactie/feedback** (o reactie din 4)  

### Student
- Partea de sus a ecranului este activitatea  
- Partea de jos un UI cu cele 4 reactii, care este prezenta si nu se schimba niciodata pe perioada activitatii  

### La sfarsitul activitatii
#### Pentru studenti
1. Poti da un feedback final care sa reflecte overall ce crede studentul  
**SAU**  
2. Activitatea se incheie fara optiunea de a mai da feedback  

#### Pentru profesor
- Profesorul se intoarce la home screen (butonul de generare cod activitate + nume etc.)  
- Log-ul cu feedback-ul continuu este salvat intr-un fisier  

---

## Descrieri detaliate

### INTERFATA LOGIN SCREEN
- Nume + parola si un radio profesor/student  
- Se face validare si vei fi trimis la interfata Home Screen  

### INTERFATA HOME SCREEN PROFESOR
- Textbox pentru numele activitatii  
- Buton care porneste activitatea  
- Codul activitatii este generat automat si data este cea din momentul crearii  
- Se schimba ecranul pe interfata activitate  
- Exista un istoric al activitatilor din trecut acompaniate de rating-ul acestora  

### INTERFATA HOME SCREEN STUDENT
- Input unde introduci codul si se valideaza daca exista si este valabila la acel moment o activitate  

### INTERFATA ACTIVITATE PROFESOR
- Partea de sus a ecranului este activitatea propriu-zisa  
- In partea de jos (un sfert al ecranului) apare feedback-ul continuu ca un chat (data feedback-ului si tipul de feedback)  
- Profesorul are acces la un buton care sa incheie activitatea (esti trimis la interfata de sfarsit a activitatii)  

### INTERFATA ACTIVITATE STUDENT
- Partea de sus a ecranului reprezinta activitatea desfasurata de profesor  
- Partea de jos a ecranului reprezinta 4 butoane cu feedback-ul respectiv, care pot fi apasate oricand  

### INTERFATA SFARSIT ACTIVITATE PROFESOR
- Un download button pentru log-ul de feedback  
- Un ecran de statistici bazat pe feedback-ul continuu (descarcabil la alegere)  
- Un buton care te intoarce la interfata de Home Screen  

### INTERFATA SFARSIT ACTIVITATE STUDENT
- Ai un feedback final pe care poti sa-l dai pentru cum crezi ca a fost activitatea overall (star rating 0-5)  
- Un buton pentru a merge inapoi la Home Interface  

---

## Plan de proiect
- Realizarea unei aplicatii profesor–student cu feedback in timp real  
- Frontend SPA (React.js) + Backend REST (Node.js + Express)  
- Baza de date relationala + ORM  
- Versionare in Git cu commit-uri incrementale si descrieri clare  
- Deploy pe server (Azure / AWS / Render)  

---

## Livrabile partiale
1. **16.11.2025** - Specificatii detaliate, plan de proiect, prezenta unui proiect in git  
2. **06.12.2025** - Serviciu RESTful functional + instructiuni de rulare  
3. **Ultimul seminar** - Aplicatia completa + demo  

---

## Instrucțiuni de Rulare

### 1. Pornire Server (Backend)
1. Deschide un terminal.
2. Navighează în folderul `server`:
   ```bash
   cd server
   ```
3. Instalează dependențele (dacă nu ai făcut-o deja):
   ```bash
   npm install
   ```
4. Pornește serverul:
   ```bash
   npm run dev
   ```
   *Serverul rulează pe http://localhost:5000*

### 2. Pornire Client (Frontend)
1. Deschide un **nou** terminal.
2. Navighează în folderul `client`:
   ```bash
   cd client
   ```
3. Instalează dependențele (dacă nu ai făcut-o deja):
   ```bash
   npm install
   ```
4. Pornește aplicația:
   ```bash
   npm run dev
   ```
   *Clientul rulează pe http://localhost:5173*

### 3. Utilizare
- Deschide http://localhost:5173 în browser.
- Poți deschide mai multe tab-uri (sau ferestre Incognito) pentru a simula profesorul și studenții simultan.
