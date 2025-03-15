import { useAuth } from "../context/AuthContext";
import "./MyPage.css"

const MyPage = () => {

  // Använder user från contextet.
  const { user } = useAuth();

  return (
    <>
      <h1>Min sida</h1>

      <h2>{user ? user.username : ""}</h2>
    </>
  )
}

export default MyPage
