import { useState } from "react";
import { MovieInterface } from "../types/movie.types";
import "./HomePage.css";

import { ToastContainer, toast } from 'react-toastify';

// API-nyckel hämtas från .env-fil.
const API_KEY = import.meta.env.VITE_API_KEY;

const HomePage = () => {

  // States.
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<MovieInterface[]>([]);
  const [filter, setFilter] = useState("Filmtitel");

  // Flagga som indikerar om en sökning gjorts.
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Funktion som hanterar filmsökning.
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {

    // Förhindrar defaultbeteende.
    e.preventDefault();

    // Säkerställer att sökfras ej är tom.
    if (!search.trim()) {
      toast.error("Skriv in en sökfras!");
      return;
    }

    // Markerar att en sökning har genomförts.
    setHasSearched(true);

    // Hämtar filmer från TMDB API utifrån sökfras.
    try {

      // Konfigurerar headers för API-anrop.
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`
        }
      };

      // Hämtar sökresultat med en GET-förfrågan.
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(search)}`, options);

      // Konverterar resultatet till JSON.
      const data = await res.json();

      // Kontrollerar om resultat finns.
      if (data.results) {

        // Sorterar filmerna utifrån premiärår (nyast först).
        const sortedMovies = data.results.sort((a: MovieInterface, b: MovieInterface) => {
          // Konverterar release_date till årtal.
          const yearA = parseInt(a.release_date.substring(0, 4));
          const yearB = parseInt(b.release_date.substring(0, 4));
          return yearB - yearA;
        });

        // Sätter state för movie till resultatet.
        setMovies(sortedMovies);

        // Om resultat ej finns, skickas en fel-toast.
      } else {
        toast.error("Inga resultat hittades.");
      }
      // Fel-toast skickas.
    } catch (error) {
      toast.error("Något gick fel vid hämtningen.");
      // TEST-logg.
      console.log(error);
    }
  };

  // Funktion som återställer sökfält och resultatlista.
  const handleClear = () => {
    setSearch("");
    setMovies([]);

    // Sätter sökningsflagga till false.
    setHasSearched(false);
  };

  return (
    <>
      <h1>Välkommen till CineQuery!</h1>

      <div className="text-container">
        <p className="welcome-text">
          Använd vår smidiga sökfunktion nedan för att snabbt få tillgång till filmfakta.
        </p>
        <p className="welcome-text">
          Välj din sökfiltrering: filmtitel, regissör, premiärår eller genre. Skriv sedan
          in din sökfras, tryck “sök” och voila, så har du ditt sökresultat!
        </p>
      </div>

      <div className="container-search">
        <form className="search-form" onSubmit={handleSearch}>
          <label htmlFor="filter">Filtrering:</label>
          <select
            name="filter"
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>Filmtitel</option>
          </select>
          <br />
          <label htmlFor="search">Sökfras:</label>
          <input
            type="text"
            id="search"
            placeholder="Din sökfras"
            required
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <br />
          <input type="submit" value="Sök" />
        </form>
        <ToastContainer />
      </div>

      {/* Visar tabell med resultat om en sökning har gjorts */}
      {hasSearched && (
        <div className="results">
          <h2 id="results-h2">Sökresultat på: {search}</h2>
          <>
            <table className="movie-table">
              <thead>
                <tr>
                  <th>Filmtitel</th>
                  <th>År</th>
                  <th>Info</th>
                </tr>
              </thead>
              <tbody>
                {/* Loopar igenom filmresultaten och skapar en tabellrad för varje film. */}
                {movies.map(movie => (
                  <tr key={movie.id}>
                    <td>{movie.title}</td>
                    <td>{movie.release_date ? movie.release_date.substring(0, 4) : "Okänt"}</td>
                    <td>Läs mer</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Knapp för att rensa sökresultaten */}
            <div className="button-container">
              <button id="clear-results" onClick={handleClear}>Rensa sökresultat</button>
            </div>
          </>
        </div>
      )}
    </>
  )
}

export default HomePage
