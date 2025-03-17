// API-nyckel hämtas från .env-fil.
const API_KEY = import.meta.env.VITE_API_KEY;

export const fetchAPI = async (url: string) => {
  // Konfigurerar headers för API-anrop.
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  };

  // Skickar GET-förfrågan till angiven URL.
  const res = await fetch(url, options);

  // Om svaret inte är OK hämtas specifikt felmeddelande från backend-API:et.
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
  }

  // Returnerar det parsade JSON-svaret.
  return await res.json();
};