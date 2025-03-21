import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { ReviewInterface } from "../types/review.types";
import { Link } from "react-router-dom";
import "./MyPage.css"

import { showSuccessToast, showErrorToast } from "../helpers/toastHelper";

const MyPage = () => {

  // Använder user från AuthContext.
  const { user } = useAuth();

  // States.
  const [myReviews, setMyReviews] = useState<ReviewInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [movieCount, setMovieCount] = useState<number>(0);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // States för formulär. 
  const [reviewToEditId, setReviewToEditId] = useState<string | null>(null);
  const [reviewTextToEdit, setReviewTextToEdit] = useState<string>("");
  const [ratingToEdit, setRatingToEdit] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

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

  // Körs vid sidladdning eller när användare ändras. Hämtar statistik och recensioner.
  useEffect(() => {

    // Hämtar antal filmer som inloggad användaren markerat som sedda från localStorage.
    if (user) {
      const watchedMovies = JSON.parse(localStorage.getItem(`watchedMovies_${user.id}`) || "[]");

      // Sätter längden på arrayen som state för MovieCount.
      setMovieCount(watchedMovies.length);
    }

    // Anropar funktionen.
    fetchMyReviews();
  }, [user]);

  // Hanterar klick på uppdateringsknapp.
  const handleEditClick = (review: ReviewInterface) => {
    setReviewToEditId(review._id);
    setReviewTextToEdit(review.reviewText);
    setRatingToEdit(review.rating.toString());
    setFormError(null);
  };

  // Hanterar submit av redigerat formulär (PUT-anrop).
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>, review: ReviewInterface) => {

    // Förhindrar defaultbeteende.
    e.preventDefault();

    // Validerar formuläret.
    if (!reviewTextToEdit || !ratingToEdit) {
      setFormError("Alla fält måste fyllas i.");
      return;
    }

    // Gör ett PUT-anrop mot API:et och skickar med recensionsID.
    try {
      const res = await fetch(`https://react-projekt-cinequery-api.onrender.com/reviews/${review._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // Fyller i formuläret med lagrad information.
        body: JSON.stringify({
          movieId: review.movieId,
          movieTitle: review.movieTitle,
          userId: user!.id,
          rating: Number(ratingToEdit),
          reviewText: reviewTextToEdit.trim(),
        }),
      });

      // Hanterar oväntat svar och kastar då ett fel med backend-fel eller generellt meddelande.
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Något gick fel när recensionen skulle uppdateras.");
      }

      // Visar en bekräftelse-toast vid lyckat uppdatering. 
      showSuccessToast("Recensionen har uppdaterats!");

      // Återstället state för recensionsID.
      setReviewToEditId(null);

      // Anropar funktionen för att uppdatera listan.
      fetchMyReviews();

      // Hanterar fel om API-anropet misslyckas.
    } catch (error: any) {
      showErrorToast(error.message);
    }
  };

  // Hanterar radering av recension. Kräver dubbelklick för bekräftelse.
  const handleDelete = async (reviewId: string, movieTitle: string) => {

    // Vid klick på radera-knappen...
    if (confirmDelete !== reviewId) {

      // Sätter recensionsId för vald film i statet.
      setConfirmDelete(reviewId);

      // Visar en toast som beskriver hur användaren ska göra för att bekräfta radering
      showSuccessToast(`Klicka på "radera" igen för att bekräfta — eller vänta så återställs knappen automatiskt.`);

      // Återställer automatiskt till defaultläge efter 5 sekunder.
      setTimeout(() => setConfirmDelete(null), 5000);

      // Vyn returneras igen.
      return;
    }

    // Om användaren klickar på radera igen raderas recensionen.
    try {
      const res = await fetch(`https://react-projekt-cinequery-api.onrender.com/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Hanterar oväntat svar och kastar då ett fel med backend-fel eller generellt meddelande.
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Något gick fel vid radering.");
      }

      // Uppdaterar statet genom att filtrera bort den raderade recensionen från listan.
      setMyReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));

      // Visar bekräftelse-toast.
      showSuccessToast(`Recensionen för \"${movieTitle}\" har raderats!`);

      // Återställer bekräftelsen direkt vid lyckad radering.
      setConfirmDelete(null);

      // Hanterar fel om API-anropet misslyckas.
    } catch (error: any) {
      console.error(error);
      showErrorToast(error.message);
      setConfirmDelete(null);
    }
  };

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
                <h3 id="movietitle-h3"><Link to={`/${review.movieId}`}>{review.movieTitle}</Link></h3>
                <p><strong>Skapad:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
                <p><strong>Betyg:</strong> {review.rating}/5</p>
                <p><strong>Recension:</strong> “{review.reviewText}”</p>

                {/* Knappar för att ändra/radera recensioner. */}
                <div className="button-container mypage">
                  <button className="yellow-button button" onClick={() => handleEditClick(review)}>Ändra</button>
                  <button
                    className="red-button button"
                    onClick={() => handleDelete(review._id, review.movieTitle)}
                  >
                    {confirmDelete === review._id ? "Bekräfta radering" : "Radera"}
                  </button>
                </div>

                {/* Redigeringsformulär som visas när användaren klickar på uppdatera-knappen. */}
                {reviewToEditId === review._id && (
                  <div className="form-container">
                    <h2 id="form-h2">Redigera recension</h2>
                    <form className="review-form" onSubmit={(e) => handleEditSubmit(e, review)}>
                      <label htmlFor="movietitle">Filmtitel:</label>
                      <input type="text" value={review.movieTitle} readOnly />

                      <label htmlFor="review">Recension:</label>
                      <textarea
                        name="review"
                        id="review"
                        value={reviewTextToEdit}
                        onChange={(e) => setReviewTextToEdit(e.target.value)}
                      />

                      <label htmlFor="score">Betyg:</label>
                      <select
                        name="score"
                        id="score"
                        value={ratingToEdit}
                        onChange={(e) => setRatingToEdit(e.target.value)}
                      >
                        <option value="">Välj betyg</option>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </select>

                      {/* Eventuella formulärfel visas här. */}
                      {formError && <p className="error">{formError}</p>}

                      <div className="button-container-tight">
                        <button type="submit" className="blue-button button">Spara</button>
                        <button
                          type="button"
                          className="red-button button"
                          onClick={() => setReviewToEditId(null)}
                        >
                          Avbryt
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyPage;
