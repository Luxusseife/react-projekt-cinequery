import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./LoginPage.css";

import { ToastContainer, toast } from 'react-toastify';

const LoginPage = () => {

  // States för komponenten.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

      // Vid lyckad inloggning visas en toast-bekräftelse. 
      toast.success("Inloggningen lyckades!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: true,
        style: {
          backgroundColor: "#ffffff",
          color: "#000000",
          fontSize: "20px",
          padding: "1rem",
        },
        // Omdirgierar till Min sida när toastens tidsfrist gått ut.
        onClose: () => navigate("/mypage"),
      });

      // Vid misslyckad inloggning, visas en error-toast.
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, {
          position: "top-center",
          autoClose: 3000,
          pauseOnHover: true,
          style: {
            backgroundColor: "#ffe6e6",
            color: "#ff0000",
            fontSize: "20px",
            padding: "1rem",
          },
        });
      } else {
        toast.error("Inloggningen misslyckades. Prova igen!", {
          position: "top-center",
          autoClose: 3000,
          pauseOnHover: true,
          style: {
            backgroundColor: "#ffe6e6",
            color: "#ff0000",
            fontSize: "20px",
            padding: "1rem",
          },
        });
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
          <input type="submit" value="Logga in" />
        </form>
        <ToastContainer />
      </div>
      <p className="register">Inget konto än? Registrera dig <Link className="register-link" to="/register"><strong>här</strong></Link>!</p>
    </>
  )
}

export default LoginPage
