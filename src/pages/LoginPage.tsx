import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {

  // States för komponenten.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Properties från hooken useAuth.
  const { login, user } = useAuth();

  // Ställer i navigate.
  const navigate = useNavigate();

  // Kontrollerar om det finns en inloggad användare. Körs varje gång user ändras.
  useEffect(() => {
    if (user) {
      navigate("/mypage");
    }
  }, [user])

  // Hanterar submit av formulär.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Förhindrar default-beteende.
    e.preventDefault();

    // Nollställer error-state (felmeddelanden försvinner).
    setError("");

    // Försöker logga in användaren.
    try {
      // Använder angivna värden för inloggning.
      await login({ username, password });

      // Vid lyckad inloggning omdirigeras hen till admin-sidan.
      navigate("/mypage");

      // Vid misslyckad inloggning, visas ett felmeddelande.
    } catch (error) {
      setError("Inloggningen misslyckades. Kontrollera angivet användarnamn och lösenord.")
    }
  }

  return (
    <div>
      <h1>Logga in</h1>

      <div className="container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Användarnamn:</label>
          <input
            type="username"
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
          {error && (
            <div className="error-message">{error}</div>
          )}
          <br />
          <input type="submit" value="Logga in" />
        </form>
      </div>
      <p className="register">Inget konto än? Registrera dig <Link className="register-link" to="/register"><strong>här</strong></Link>!</p>
    </div>
  )
}

export default LoginPage
