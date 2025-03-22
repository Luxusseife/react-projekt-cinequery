# Projekt, React

CineQuery är en webbaserad plattform där användare kan söka efter filmer via TMDB API, läsa information och recensioner samt själva skriva, redigera och ta bort recensioner efter att ha skapat ett användarkonto. Webbplattformen är fullt responsiv för mobil, surfplatta och desktop och erbjuder tydlig och användarvänlig UI-feedback direkt i gränssnittet och via toast-meddelanden.

## Utveckling

- API är TMDB API för filmdata
- backend skapat med Node.js, Express och MongoDB
- frontend skapat med React, TypeScript, React Router, React Context API och React Toastify

### Funktioner för ej inloggad användare

- söka filmer utifrån filmtitel med sökresultat presenterade i en tabell
- se detaljvy med filminformation, filmposter och lagrade recensioner

### Ytterligare funktioner för inloggad användare

- registrera ett konto
- logga in och logga ut
- skriva recensioner i detaljvyn
- hantera recensioner (uppdatera/radera) på min sida
- markera filmer som sedda
- se statistik för sedda filmer och skrivna recensioner på Min sida

