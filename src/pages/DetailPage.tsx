import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { fetchAPI } from '../api/api';
import { MovieInterface } from "../types/movie.types";
import { useAuth } from "../context/AuthContext";
import { ReviewInterface } from "../types/review.types";
import "./DetailPage.css";

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
  const [error, setError] = useState<string | null>(null);
  const [hasWatched, setHasWatched] = useState<boolean>(false);
  const [reviews, setReviews] = useState<ReviewInterface[]>([]);

  // States för recensionsformulär.
  const [review, setReview] = useState<string | null>(null);
  const [score, setScore] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [hasBeenReviewed, setHasBeenReviewed] = useState<boolean>(false);

  // Hanterar formulär-toggle.
  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

  // Kör funktionen för att hämta filmdata varje gång ID i URL:en ändras.
  useEffect(() => {

    // Hämtar in detaljer om specifik film från API:et.
    const fetchMovieDetails = async () => {

      // Sätter laddningstatus till true.
      setLoading(true);

      // Återställer felmeddelanden.
      setError(null);

      // Återställer "har redan recenserat-flaggan" vid laddning av ny film.
      setHasBeenReviewed(false);

      // Hämtar filmdata från API:et utifrån ID och språkparameter (svenska).
      try {
        const url = `https://api.themoviedb.org/3/movie/${id}?language=sv-SE`;
        const data = await fetchAPI(url);

        // Sätter state för movie till resultatet.
        setMovie(data);

        // Kontrollerar om filmen är markerad som sedd.
        if (user) {
          const watchedMovies = JSON.parse(localStorage.getItem(`watchedMovies_${user.id}`) || "[]");
          setHasWatched(watchedMovies.includes(data.id));
        }

        // TEST-logg.
        // console.log(data);

        // Kontrollerar om den inloggade användaren redan har recenserat filmen.
        if (user) {
          // Skickar en GET-förfrågan till API:et. Skickar med movieId och userId. JWT-token skickas i header för endast inloggad användare kan skicka förfrågan.
          const res = await fetch(`https://react-projekt-cinequery-api.onrender.com/reviews?movieId=${id}&userId=${user.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });

          // Om serversvaret är OK, parsas datan till JSON.
          if (res.ok) {
            const reviewData = await res.json();

            // Om det finns minst en recension från användaren för denna film, sätts flaggan till true och recensionsknapp/formulär döljs.
            if (reviewData.length > 0) {
              setHasBeenReviewed(true);
            }
          }
        }

        // Felhantering.
      } catch (error: any) {
        // Lagrar aktuellt felmeddelande i error-state.
        setError(error.message || "Något gick fel.");
        // Sätter laddningstatus till false när anropet avslutats.
      } finally {
        setLoading(false);
      }
    };

    // Om ett ID finns i URL:en, anropas funktionerna.
    if (id) {
      fetchMovieDetails();
      fetchMovieReviews();
    }
  }, [id, user]);

  // Hämtar lagrade recensioner om aktuell film.
  const fetchMovieReviews = async () => {
    try {
      const res = await fetch(`https://react-projekt-cinequery-api.onrender.com/reviews/movie/${id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);

        // TEST-logg.
        // console.log(id);
      }
    } catch (error) {
      console.error("Kunde inte hämta recensioner:", error);
    }
  };

  // Hanterar klick på "Har sett filmen"-knappen.
  const handleWatchedMovie = () => {
    // Avbryter om filmen eller user inte finns.
    if (!movie || !user) return;

    // Hämtar listan över lagrade "har sett"-filmer från inloggad användares localStorage (eller en tom array om inga setts).
    const watchedMovies = JSON.parse(localStorage.getItem(`watchedMovies_${user.id}`) || "[]");

    // Kontrollerar om aktuell film redan är lagrad.
    if (!watchedMovies.includes(movie.id)) {
      // Lägger till filmens ID i listan över sedda filmer.
      const updatedMovies = [...watchedMovies, movie.id];

      // Uppdaterar localStorage med den nya listan.
      localStorage.setItem(`watchedMovies_${user.id}`, JSON.stringify(updatedMovies));

      // Uppdaterar visningsstatus.
      setHasWatched(true);

      // Visar en bekräftelse-toast.
      showSuccessToast(`Du har markerat att du sett ${movie.title}! Hur var filmen? Skriv gärna en recension.`);
    }
  };

  // Hanterar "Har inte sett filmen"-knappen.
  const handleNotWatchedMovie = () => {
    if (!movie || !user) return;

    // Hämtar listan över lagrade "har sett"-filmer från localStorage (eller en tom array om inga setts).
    const watchedMovies = JSON.parse(localStorage.getItem(`watchedMovies_${user.id}`) || "[]");

    // Filtrerar bort den aktuella filmen.
    const updatedMovies = watchedMovies.filter((movieId: number) => movieId !== movie.id);

    // Uppdaterar localStorage med den nya listan.
    localStorage.setItem(`watchedMovies_${user.id}`, JSON.stringify(updatedMovies));

    // Uppdaterar visningsstatus.
    setHasWatched(false);

    // Visar en bekräftelse-toast.
    showSuccessToast(`Du har markerat att du inte sett ${movie.title}.`);
  };

  // Hanterar submit av recensionsformuläret. Lagrar recensionen i databasen.
  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    // Hindrar defaultbeteende. 
    e.preventDefault();

    // Återställer formulär-fel.
    setFormError(null);

    // Validerar formulärfält.
    if (!review || !score || !id || !user) {
      setFormError("Alla fält måste fyllas i.");
      return;
    }

    // Lagrar en recension i databasen.
    try {
      const res = await fetch("https://react-projekt-cinequery-api.onrender.com/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          movieId: id,
          userId: user.id,
          rating: Number(score),
          reviewText: review.trim(),
        }),
      });

      // Hanterar oväntat svar och kastar då ett fel med backend-fel eller generellt meddelande.
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Något gick fel när recensionen skulle skapas.");
      }

      // Visar bekräftelse-toast.
      showSuccessToast("Din recension har sparats!");

      // Återställer och döljer formuläret samt knapp.
      setReview(null);
      setScore(null);
      setShowReviewForm(false);
      setHasBeenReviewed(true);
      await fetchMovieReviews(); 

      // Hanterar fel om API-anropet misslyckas.
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  // Visar laddnings- eller felmeddelande vid behov.
  if (loading) return <p className="message">Laddar filmdata...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!movie) return <p className="error">Ingen film hittades.</p>;

  return (
    <>
      <h1 className="detail-h1">Filmfakta om: <br />{movie.title.toUpperCase()}</h1>

      <div className="container-movie">

        {/* Visar filmens poster om den existerar, annars visas en fallback-poster. */}
        <div className="container-poster">
          <div className="img-container">
            <img
              id="movie-poster"
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/fallback-poster.jpg"}
              alt={movie.title}
            />
          </div>
        </div>

        {/* Visar filmens information. Raderna visas endast om de har värden i datasvaret (ej "" eller null). */}
        <div className="container-info">
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
                <button className="blue-button button" id="watched-button" onClick={handleWatchedMovie}>Har sett filmen</button>
              ) : (
                <button className="grey-button button" id="not-watched-button" onClick={handleNotWatchedMovie}>Har inte sett filmen</button>
              )}
            </div>
          )}
          {user && hasWatched && (
            <p className="status">Du har markerat att du sett denna film.</p>
          )}
        </div>
      </div>

      <div className="line-detail"></div>

      {/* Alla lagrade recensioner för aktuell film visas (eller ingen om noll recensioner). */}
      <h2 id="reviews-h2">Recensioner</h2>
      <div className="reviews-container">
        <div className="review-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="review-item">
                <p><strong>Skapad:</strong> {new Date(review.createdAt).toLocaleDateString()} av <strong>{review.userId.username}</strong></p>
                <p><strong>Betyg:</strong> {review.rating}/5</p>
                <p><strong>Recension:</strong> "{review.reviewText}"</p>
              </div>
            ))
          ) : (
            <p>Inga recensioner har skrivits för denna film ännu.</p>
          )}
        </div>
      </div>

      {/* Skriv recension-knapp som endast visas för inloggad användare. Fäller ut ett formulär (och knappen försvinner). */}
      {user && !hasBeenReviewed && (
        <div className="button-container-tight">
          {!showReviewForm && (
            <button className="blue-button button" onClick={toggleReviewForm}>
              Skriv recension
            </button>
          )}
        </div>
      )}

      {/* Formulär för att skriva en recension för aktuell film. */}
      {user && showReviewForm && !hasBeenReviewed && (
        <div className="form-container">
          <h2 id="form-h2">Skriv recension</h2>
          <br />
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <label htmlFor="movietitle">Filmtitel:</label>
            <input type="text" name="movietitle" id="movietitle" value={movie.title} readOnly />

            <label htmlFor="review">Recension:</label>
            <textarea
              name="review"
              id="review"
              value={review || ""}
              onChange={(e) => setReview(e.target.value)}
            />

            <label htmlFor="score">Betyg:</label>
            <select name="score" id="score" value={score || ""} onChange={(e) => setScore(e.target.value)}>
              <option value="">Välj betyg</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>

            {formError && <p className="error">{formError}</p>}

            <div className="button-container-tight">
              <button type="submit" className="blue-button button">Spara</button>
              <button
                type="button"
                className="red-button button"
                onClick={() => {
                  setShowReviewForm(false);
                  setReview(null);
                  setScore(null);
                  setFormError(null);
                }}
              >
                Avbryt
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Tillbaka-knapp. Skickar användaren tillbaka till startsidan med intakta sökresultat. */}
      <div className="button-container-tight">
        <Link className="yellow-button button" to="/" state={{ search, movies, scrollToResults: true }}>Tillbaka</Link>
      </div>
    </>
  );
};

export default DetailPage;