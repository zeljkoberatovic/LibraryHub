# Detaljan opis aplikacije

## Opis
Ova aplikacija je moderna digitalna biblioteka razvijena u Angularu, sa ciljem da omogući jednostavno upravljanje knjigama, korisnicima, iznajmljivanjem i administracijom biblioteke. Svi podaci se prikazuju u realnom vremenu, a korisnički interfejs je prilagođen i studentima i bibliotekarima.

## Funkcionalnosti
- **Dashboard (Kontrolna tabla):**
  - Prikaz trenutnog stanja biblioteke, aktivnosti i statistike.
  - Vizuelizacija podataka kroz tortne dijagrame (ngx-charts).
  - Prikaz posljednjih aktivnosti (izdavanja knjiga).
- **Autentifikacija i autorizacija:**
  - Prijava i registracija korisnika (studenti, bibliotekari).
  - Različiti nivoi pristupa (student, bibliotekar).
  - Auth guard za zaštitu ruta.
- **Knjige:**
  - Pregled, dodavanje, izmjena i brisanje knjiga.
  - Detaljan prikaz knjige, povezivanje sa autorima, žanrovima, izdavačima i kategorijama.
  - Rezervacija i izdavanje knjiga.
  - Prikaz dostupnosti, broja izdatih, rezervisanih i prekoračenih knjiga.
- **Studenti:**
  - Pregled, dodavanje, izmjena i brisanje studenata.
  - Detaljan prikaz i istorija iznajmljivanja.
- **Bibliotekari:**
  - Pregled, dodavanje, izmjena i brisanje bibliotekara.
  - Detaljan prikaz i administracija.
- **Izdavanje i vraćanje knjiga:**
  - Upravljanje iznajmljenim i vraćenim knjigama.
  - Prikaz svih iznajmljivanja i vraćanja sa filtrima i pretragom.
- **Rezervacije:**
  - Prikaz i upravljanje rezervacijama (u pripremi, placeholder prikaz).
- **Podešavanja:**
  - Upravljanje kategorijama, žanrovima, izdavačima, vrstama poveza, formatima i pismima.
- **Shared komponente:**
  - Header, sidebar, paginacija, not found stranica.
- **Guards, interceptors, resolvers:**
  - Zaštita ruta, automatsko dodavanje tokena, globalni error handler, preuzimanje podataka prije prikaza stranice.
- **Modeli i servisi:**
  - Centralizovani modeli za sve entitete.
  - Servisi za komunikaciju sa backendom i upravljanje podacima.

## Moduli i organizacija
- `src/app/pages/dashboard` – kontrolna tabla i statistika
- `src/app/pages/books` – upravljanje knjigama
- `src/app/pages/student` – upravljanje studentima
- `src/app/pages/librarians` – upravljanje bibliotekarima
- `src/app/pages/issuing` – izdavanje i vraćanje knjiga
- `src/app/pages/settings` – podešavanja
- `src/app/auth` – autentifikacija i registracija
- `src/app/core` – guards, interceptors, error handler
- `src/app/models` – svi modeli podataka
- `src/app/services` – svi servisi
- `src/app/shared` – zajedničke komponente
- `src/app/resolvers` – resolveri za pre-fetch podataka
- `src/app/routes` – organizacija ruta

## Tehnologije
- Angular (standalone komponente, reactive services, routing, resolvers)
- RxJS
- ngx-charts (vizualizacija statistike)
- TypeScript
- REST API backend

## Pokretanje aplikacije
1. Instalirajte zavisnosti:
   ```bash
   npm install
   ```
2. Pokrenite razvojni server:
   ```bash
   npm start
   ```
3. Otvorite aplikaciju u browseru na adresi [http://localhost:4200](http://localhost:4200)

## Autor
Ovu aplikaciju je razvila osoba čiji je cilj bio da prikaže napredne mogućnosti Angulara u domenu digitalnih biblioteka. Za sva pitanja ili sugestije, kontaktirajte autora putem repozitorijuma.

## Napomene

Većina podataka dolazi direktno iz baze i prikazuje tačne informacije.
Backend logiku nisam ja razvijao, zbog čega je u nekim slučajevima bilo potrebno koristiti djelimične podatke ili nasumične vrijednosti. Zbog toga može doći do manjih problema ili ograničenja u pojedinim dijelovima aplikacije (npr. rezervacije, statistika i slične funkcionalnosti koje zavise od potpune backend podrške).

---