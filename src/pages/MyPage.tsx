import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { ReviewInterface } from "../types/review.types";
import "./MyPage.css"

const MyPage = () => {

  // Använder user från AuthContext.
  const { user } = useAuth();

  // States.
  const [myReviews, setMyReviews] = useState<ReviewInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [movieCount, setMovieCount] = useState<number>(0);

  // Kör funktionen för att hämta recensioner vid mount och varje gång user ändras.
  useEffect(() => {

    // Hämtar antal filmer som inloggad användaren markerat som sedda från localStorage.
    if (user) {
      const watchedMovies = JSON.parse(localStorage.getItem(`watchedMovies_${user.id}`) || "[]");

      // Sätter längden på arrayen som state för MovieCount.
      setMovieCount(watchedMovies.length);
    }

    // Hämtar recensioner skrivna av den inloggade användaren.
    const fetchMyReviews = async () => {

      // Är ingen inloggad returneras vyn avbryts funktionen.
      if (!user) return;

      // Visar laddningsstatus och återställer felmeddelande.
      setLoading(true);
      setError(null);

      // API-anrop med GET för att hämta användarens recensioner.
      try {
        const res = await fetch(`https://react-projekt-cinequery-api.onrender.com/reviews?userId=${user.id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        )

        // Hanterar svar från servern.
        if (res.ok) {
          const data = await res.json();

          // Vid lyckat svar sparas data i state för recensioner.
          setMyReviews(data);

          // Vid misslyckat svar visas felmeddelande.
        } else {
          const errorData = await res.json();
          setError(errorData.error || "Något gick fel när recensionerna skulle hämtas.");
        }
        // Felhantering där felen sparas i error-state. 
      } catch (error: any) {
        setError(error);
        // Laddningsstatus sätts till false när anropet gjorts.
      } finally {
        setLoading(false);
      }
    }

    // Anropar funktionen.
    fetchMyReviews();
  }, [user]);

  return (
    <>
      <h1>Min sida</h1>

      <div className="user-info">
        {/* Visar användarnamn och statistik för inloggad användare. */}
        <h2 id="username-h2">{user ? user.username : ""}</h2>
        <h3>Statistik</h3>
        <div className="statistics">
          <p>Du har sett <strong>{movieCount}</strong> filmer.</p>
          <p>Du har recenserat <strong>{myReviews.length}</strong> filmer.</p>
        </div>
      </div>

      {/* Avskiljarlinje. */}
      <div className="line-mypage"></div>

      {/* Visar användarens recensioner i en lista. */}
      <div className="myreviews-container">
        <h2 id="myreviews-h2">Mina recensioner</h2>
        <div className="myreview-list">

          {/* Visar eventuella fel- och meddelanden. */}
          {loading && <p>Laddar recensioner...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && myReviews.length === 0 && (
            <p>Du har inte skrivit några recensioner ännu.</p>
          )}

          {/* Loopar igenom recensioner och skriver ut. */}
          {myReviews.map((review) => (
            <div key={review._id} className="myreviews-listitem">
              <div className="review-item">
                <p><strong>Skapad:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
                <p><strong>Betyg:</strong> {review.rating}/5</p>
                <p><strong>Recension:</strong> “{review.reviewText}”</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default MyPage
