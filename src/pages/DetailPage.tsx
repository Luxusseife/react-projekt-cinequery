import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { fetchAPI } from '../api/api';
import { MovieInterface } from "../types/movie.types";
import "./DetailPage.css";

const DetailPage = () => {

  // Hämtar film-id från URL:en.
  const { id } = useParams<{ id: string }>();

  // Ställer in useLocation.
  const location = useLocation();

  // Tar emot skickad state från HomePage i form av sökfras och resultat.
  const { search, movies } = location.state || { search: "", movies: [] }

  // States.
  const [movie, setMovie] = useState<MovieInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

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

        // TEST-logg.
        // console.log(data);

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

  // Visar laddnings- eller felmeddelande vid behov.
  if (loading) return <p className="message">Laddar filmdata...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p className="error">Ingen film hittades.</p>;

  return (
    <>
      <h1 className="detail-h1">Filmfakta om: <br />{movie.title.toUpperCase()}</h1>

      {/* Visar filmens poster om den existerar, annars visas en fallback-poster. */}
      <div className="img-container">
        <img
          id="movie-poster"
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/fallback-poster.jpg"}
          alt={movie.title}
        />
      </div>

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
        {movie.runtime &&
          <p><strong>Filmlängd:</strong> {movie.runtime} minuter</p>
        }
        <br />
        {movie.overview &&
          <p>{movie.overview}</p>
        }

      </div>

      {/* Tillbaka-knapp. Skickar användaren tillbaka till startsidan. */}
      <div className="button-container">
        <Link className="go-back" to="/" state={{ search, movies, scrollToResults: true }}>Tillbaka</Link>
      </div>
    </>
  )
}

export default DetailPage
