import { Link } from "react-router-dom";
import "./LoginPage.css";
import "./RegistrationPage.css";

const RegistrationPage = () => {
  return (
    <div>
      <h1>Registrera dig</h1>

      <div className="container">
        <form /*onSubmit={handleRegistration}*/>
          <label htmlFor="username">Användarnamn:</label>
          <input
            type="username"
            id="username"
            placeholder="Ditt amvändarnamn"
            required
            /*value={username}
            onChange={(e) => setUsername(e.target.value)} *//>
          <br />
          <label htmlFor="password">Lösenord:</label>
          <input
            type="password"
            id="password"
            placeholder="Ditt lösenord"
            required
            /*value={password}
            onChange={(e) => setPassword(e.target.value)} *//>
          <br />
          {/*error && (
            <div className="error-message">{error}</div>
          )*/}
          <br />
          <input type="submit" value="Logga in" />
        </form>
      </div>
      <div className="button-container">
      <Link className="go-back" to="/login">Tillbaka</Link>
      </div>
    </div>
  )
}

export default RegistrationPage
