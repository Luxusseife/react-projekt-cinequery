import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LoginPage.css";
import "./RegistrationPage.css";

import { showSuccessToast, showErrorToast } from "../helpers/toastHelper";

const RegistrationPage = () => {

  // States för komponenten.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  // Properties från hooken useAuth.
  const { register } = useAuth();

  // Ställer in navigate.
  const navigate = useNavigate();

  // Hanterar submit av formulär.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Förhindrar default-beteende.
    e.preventDefault();

    // Försöker registrera användaren.
    try {
      // Använder angivna värden för registrering.
      await register({ username, password });

      // Vid lyckad registrering visas en toast-bekräftelse och en omdirigering sker.
      showSuccessToast("Registreringen lyckades!", () => navigate("/login"));

      // Vid misslyckad registrering, visas en error-toast.
    } catch (error: unknown) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        showErrorToast("Registreringen misslyckades. Prova igen!");
      }
    }
  }

  return (
    <>
      <h1>Registrera dig</h1>

      <div className="container-reglog">
        <form className="reg-form" onSubmit={handleSubmit}>
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
          <input type="submit" value="Registrera" />
        </form>
      </div>
      <div className="button-container">
        <Link className="yellow-button button" to="/login">Tillbaka</Link>
      </div>
    </>
  )
}

export default RegistrationPage
