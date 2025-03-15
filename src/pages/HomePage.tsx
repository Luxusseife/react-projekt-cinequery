import "./HomePage.css";

import { ToastContainer } from 'react-toastify';

const HomePage = () => {
  return (
    <>
      <h1>Välkommen till CineQuery!</h1>

      <div className="text-container">
        <p className="welcome-text">
          Använd vår smidiga sökfunktion nedan för att snabbt få tillgång till filmfakta.
        </p>
        <p className="welcome-text">
          Välj din sökfiltrering: filmtitel, regissör, premiärår eller genre. Skriv sedan
          in din sökfras, tryck “sök” och voila, så har du ditt sökresultat!
        </p>
      </div>

      <div className="container-search">
        <form className="search-form" /*onSubmit={handleSearch}*/>
          <label htmlFor="filter">Filtrering:</label>
          <select 
          name="filter" 
          id="filter"
          /*value={filter} 
          onChange={(e) => setFilter(e.target.value)} */>
            <option>Filmtitel</option>
            <option>Regissör</option>
            <option>Genre</option>
          </select>
          <br />
          <label htmlFor="search">Sökfras:</label>
          <input
            type="text"
            id="search"
            placeholder="Din sökfras"
            required
            /*value={search}
            onChange={(e) => setSearch(e.target.value)}*/ />
          <br />
          <input type="submit" value="Sök" />
        </form>
        <ToastContainer />
      </div>

    </>
  )
}

export default HomePage
