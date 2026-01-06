# Digitalna biblioteka

Aplikacija za upravljanje bibliotekama knjiga, omogućava praćenje izdavanja knjiga, upravljanje korisnicima i postavkama biblioteke.

## Funkcionalnosti

### Kontrolna tabla
- Pregled trenutnog stanja biblioteke.
- Prikaz statusa knjiga: izdane, rezervisane, vraćene.
- Statistika po kategorijama, žanrovima i izdavačima.

### Korisnici
- Registracija i prijava studenata.
- Admin panel za bibliotekare koji upravljaju bibliotekom.
- Različiti nivoi pristupa: student vs. bibliotekar.

### Knjige
- CRUD operacije nad knjigama.
- Povezivanje knjiga sa:
  - Kategorijama
  - Žanrovima
  - Izdavačima
  - Autorima

### Podesavanja
- **Kategorije** – pregled, dodavanje, izmjena i brisanje kategorija.
- **Žanrovi** – pregled, dodavanje, izmjena i brisanje žanrova.
- **Izdavači** – pregled, dodavanje, izmjena i brisanje izdavača.
- **Knjige Podesavanja** – pregled opcija za:
  - **Povez** – vrste poveza (hardcover, softcover, itd.)
  - **Format** – formati knjiga (A4, A5, itd.)
  - **Pismo** – dostupna pisma (Cirilica / Latinica)
  > Napomena: kod Book Settings trenutno nije moguće dodavati, mijenjati ili brisati stavke, samo pregled.

## Tehnologije
- Angular (standalone components, reactive services, routing, resolvers)
- RxJS
- REST API backend

## Napomene
- Sve promjene u postavkama se odražavaju odmah i koriste Angularove servise.
- CRUD funkcionalnosti su ograničene na podatke koji se mogu mijenjati u bazi (Categories, Genres, Publishers, Books, Authors).
