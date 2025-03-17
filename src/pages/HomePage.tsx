import { useState } from "react";
import { MovieInterface } from "../types/movie.types";
import { fetchAPI } from '../api/api';
import { Link } from "react-router-dom";
import "./HomePage.css";

import { ToastContainer } from 'react-toastify';
import { showErrorToast } from "../helpers/toastHelper";

// API-nyckel hämtas från .env-fil.
//const API_KEY = import.meta.env.VITE_API_KEY;

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
      showErrorToast("Skriv in en sökfras!");
      return;
    }

    // Markerar att en sökning har genomförts.
    setHasSearched(true);

    // Hämtar filmer från TMDB API utifrån sökfras.
    try {

      const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(search)}`;
      const data = await fetchAPI(url);

      // Sorterar filmerna utifrån premiärår (nyast först).
      const sortedMovies = data.results.sort((a: MovieInterface, b: MovieInterface) => {
        // Konverterar release_date till årtal.
        const yearA = a.release_date ? parseInt(a.release_date.substring(0, 4)) : 0;
        const yearB = b.release_date ? parseInt(b.release_date.substring(0, 4)) : 0;
        return yearB - yearA;
      });

      // Sätter state för movie till resultatet.
      setMovies(sortedMovies);

      // Fel-toast skickas.
    } catch (error: unknown) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      } else {
        showErrorToast("Något gick fel vid hämtningen.");
      }
    }
  }

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
        <ol className="welcome-text-list welcome-text">
          <li>Välj en sökfiltrering.</li>
          <li>Skriv in en sökfras.</li>
          <li>Tryck “sök”. </li>
        </ol>
        <p className="welcome-text">
          Voila, så har du ditt sökresultat!
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
          {movies.length > 0 ? (
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
                      <td>
                        <Link to={`/movie/${movie.id}`}>Läs mer</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Knapp för att rensa sökresultaten */}
              <div className="button-container">
                <button id="clear-results" onClick={handleClear}>Rensa sökresultat</button>
              </div>
            </>
          ) : (
            <p className="error">Inga resultat hittades.</p>
          )}
        </div>
      )}
    </>
  )
}

export default HomePage
