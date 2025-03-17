import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { fetchAPI } from '../api/api';
import { MovieInterface } from "../types/movie.types";
import { useAuth } from "../context/AuthContext";
import "./DetailPage.css";

import { ToastContainer } from "react-toastify";
import { showSuccessToast } from "../helpers/toastHelper";

const DetailPage = () => {

  // Hämtar film-id från URL:en.
  const { id } = useParams<{ id: string }>();

  // Ställer in useLocation.
  const location = useLocation();

  // Autentiserar användare.
  const { user } = useAuth();

  // Tar emot skickad state från HomePage i form av sökfras och resultat.
  const { search, movies } = location.state || { search: "", movies: [] }

  // States.
  const [movie, setMovie] = useState<MovieInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [hasWatched, setHasWatched] = useState<boolean>(false);

  // Kör funktionen för att hämta filmdata varje gång ID i URL:en ändras.
  useEffect(() => {

    // Hämtar in detaljer om specifik film från API:et.
    const fetchMovieDetails = async () => {

      // Sätter laddningstatus till true.
      setLoading(true);

      // Återställer felmeddelanden.
      setError("");

      // Hämtar filmdata från API:et utifrån ID och språkparameter (svenska).
      try {
        const url = `https://api.themoviedb.org/3/movie/${id}?language=sv-SE`;
        const data = await fetchAPI(url);

        // Sätter state för movie till resultatet.
        setMovie(data);

        // Kontrollerar om filmen är markerad som sedd.
        const watchedMovies = JSON.parse(localStorage.getItem("watchedMovies") || "[]");
        setHasWatched(watchedMovies.includes(data.id));

        // TEST-logg.
         console.log(data);

        // Felhantering.
      } catch (error: any) {
        // Lagrar aktuellt felmeddelande i error-state.
        setError(error.message || "Något gick fel.");
        // Sätter laddningstatus till false när anropet avslutats.
      } finally {
        setLoading(false);
      }
    };

    // Om ett ID finns i URL:en, anropas funktionen.
    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  // Hanterar klick på "Har sett filmen"-knappen.
  const handleWatchedMovie = () => {
    // Avrbyter om filmen inte finns.
    if (!movie) return;

    // Hämtar listan över lagrade "har sett"-filmer från localStorage (eller en tom array om inga setts).
    const watchedMovies = JSON.parse(localStorage.getItem("watchedMovies") || "[]");

    // Kontrollerar om aktuell film redan är lagrad.
    if (!watchedMovies.includes(movie.id)) {
      // Lägger till filmens ID i listan över sedda filmer.
      const updatedMovies = [...watchedMovies, movie.id];

      // Uppdaterar localStorage med den nya listan.
      localStorage.setItem("watchedMovies", JSON.stringify(updatedMovies));

      // Uppdaterar visningsstatus.
      setHasWatched(true);

      // Visar en bekräftelse-toast.
      showSuccessToast(`Du har markerat att du sett ${movie.title}! Hur var filmen? Skriv gärna en recension.`);
    }
  };

  // Hanterar "Har inte sett filmen"-knappen.
  const handleNotWatchedMovie = () => {
    if (!movie) return;

    // Hämtar listan över lagrade "har sett"-filmer från localStorage (eller en tom array om inga setts).
    const watchedMovies = JSON.parse(localStorage.getItem("watchedMovies") || "[]");

    // Filtrerar bort den aktuella filmen.
    const updatedMovies = watchedMovies.filter((movieId: number) => movieId !== movie.id);

    // Uppdaterar localStorage med den nya listan.
    localStorage.setItem("watchedMovies", JSON.stringify(updatedMovies));

    // Uppdaterar visningsstatus.
    setHasWatched(false);

    // Visar en bekräftelse-toast.
    showSuccessToast(`Du har markerat att du inte sett ${movie.title}.`);
  };

  // Visar laddnings- eller felmeddelande vid behov.
  if (loading) return <p className="message">Laddar filmdata...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p className="error">Ingen film hittades.</p>;

  return (
    <>
      <h1 className="detail-h1">Filmfakta om: <br />{movie.title.toUpperCase()}</h1>

      <div className="container-movie">
        <div className="container-poster">
          {/* Visar filmens poster om den existerar, annars visas en fallback-poster. */}
          <div className="img-container">
            <img
              id="movie-poster"
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/fallback-poster.jpg"}
              alt={movie.title}
            />
          </div>
        </div>

        <div className="container-info">
          {/* Visar filmens information. Raderna visas endast om de har värden i datasvaret (ej "" eller null). */}
          <div className="movie-info">
            <p><strong>Filmtitel:</strong> {movie.title}</p>
            {movie.release_date &&
              <p><strong>Premiärår:</strong> {movie.release_date ? movie.release_date.substring(0, 4) : "Okänt"}</p>
            }
            {movie.genres && movie.genres.length > 0 && (
              <p>
                <strong>Genre:</strong> {movie.genres.map((genre) => genre.name).join(", ")}
              </p>
            )}
            {(movie.runtime !== null && movie.runtime !== undefined && movie.runtime !== 0) && 
              <p><strong>Filmlängd:</strong> {movie.runtime} minuter</p>
            }
            <br />
            {movie.overview &&
              <p>{movie.overview}</p>
            }
          </div>

          {/* Har sett/Har inte sett-knapp som endast visas för inloggad användare. */}
          {user && (
            <div className="button-container">
              {!hasWatched ? (
                <button className="blue-button button" onClick={handleWatchedMovie}>Har sett filmen</button>
              ) : (
                <button className="blue-button button" onClick={handleNotWatchedMovie}>Har inte sett filmen</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tillbaka-knapp. Skickar användaren tillbaka till startsidan. */}
      <div className="button-container">
        <Link className="yellow-button button" to="/" state={{ search, movies, scrollToResults: true }}>Tillbaka</Link>
      </div>

      <ToastContainer />
    </>
  )
}

export default DetailPage
