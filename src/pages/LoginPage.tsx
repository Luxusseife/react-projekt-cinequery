import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LoginPage.css";

import { showSuccessToast, showErrorToast } from "../helpers/toastHelper";

const LoginPage = () => {

  // States för komponenten.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  // Flagga för att se om inloggning sker.
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Properties från hooken useAuth.
  const { login, user } = useAuth();

  // Ställer in navigate.
  const navigate = useNavigate();

  // Kontrollerar om det finns en inloggad användare. Omdirigerar då till Min Sida direkt.
  // Om inloggning sker ignoreras omdirigeringen här.
  useEffect(() => {
    if (user && !loginSuccess) {
      navigate("/mypage");
    }
  }, [user, loginSuccess, navigate]);

  // Hanterar submit av formulär.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Förhindrar default-beteende.
    e.preventDefault();

    // Försöker logga in användaren.
    try {
      // Använder angivna värden för inloggning.
      await login({ username, password });

      // Sätter flaggan till true för att undvika att useEffect triggar omdirigeringen.
      setLoginSuccess(true);

      // Rensar felmeddelanden.
      setFormError("");

      // Vid lyckad inloggning visas en toast-bekräftelse och en omdirigering sker.
      showSuccessToast("Inloggningen lyckades!", () => navigate("/mypage"));

      // Vid misslyckad inloggning, visas en error-toast.
    } catch (error: unknown) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        showErrorToast("Inloggningen misslyckades. Prova igen!");
      }
    }
  }

  return (
    <>
      <h1>Logga in</h1>

      <div className="container-reglog">
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Användarnamn:</label>
          <input
            type="text"
            id="username"
            placeholder="Ditt användarnamn"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)} />
          <br />
          <label htmlFor="password">Lösenord:</label>
          <input
            type="password"
            id="password"
            placeholder="Ditt lösenord"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <br />
          {formError && <p className="error-message">{formError}</p>}
          <br />
          <input type="submit" value="Logga in" />
        </form>
      </div>
      <p className="register">Inget konto än? Registrera dig <Link className="register-link" to="/register"><strong>här</strong></Link>!</p>
    </>
  )
}

export default LoginPage
