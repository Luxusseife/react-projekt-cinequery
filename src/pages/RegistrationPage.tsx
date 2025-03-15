import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LoginPage.css";
import "./RegistrationPage.css";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationPage = () => {

  // States för komponenten.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Properties från hooken useAuth.
  const { register } = useAuth();

  // Ställer in navigate.
  const navigate = useNavigate();

  // Hanterar submit av formulär.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Förhindrar default-beteende.
    e.preventDefault();

    // Nollställer error-state (felmeddelanden försvinner).
    setError("");

    // Försöker registrera användaren.
    try {
      // Använder angivna värden för registrering.
      await register({ username, password });

      // Vid lyckad registrering visas en toast-bekräftelse. 
      toast.success("Registreringen lyckades! Du kan nu logga in.", {
        position: "top-center",
        autoClose: 2000, 
        pauseOnHover: true, 
        style: {
          backgroundColor: "#ffffff", 
          color: "#000000",
          fontSize: "20px",
          padding: "1rem",
        },
        // Omdirgierar till inloggningssidan när toastens tidsfrist gått ut.
        onClose: () => navigate("/login"),
      });

      // Vid misslyckad registrering, visas ett felmeddelande.
    } catch (error) {
      setError("Registreringen misslyckades. Prova igen!")
    }
  }
  return (
    <div>
      <h1>Registrera dig</h1>

      <div className="container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Användarnamn:</label>
          <input
            type="text"
            id="username"
            placeholder="Ditt amvändarnamn"
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
            onChange={(e) => setPassword(e.target.value)}/>
          <br />
          {error && (
            <div className="error-message">{error}</div>
          )}
          <br />
          <input type="submit" value="Registrera" />
        </form>
        <ToastContainer />
      </div>
      <div className="button-container">
      <Link className="go-back" to="/login">Tillbaka</Link>
      </div>
    </div>
  )
}

export default RegistrationPage
