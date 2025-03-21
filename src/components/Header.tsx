import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {

    // Använder användaruppgifter och logga ut-funktion från contextet.
    const { user, logout } = useAuth();

    // Ställer in useNavigate.
    const navigate = useNavigate();

    return (
        <header>
            <Link to="/"><img id="logo" src="/logo.png" alt="Logotyp" /></Link>

            <nav>
                <ul className="header-menu">
                    <li><NavLink className="header-link" to="/">Hem</NavLink></li>
                    <li><NavLink className="header-link" to="/mypage">Min sida</NavLink></li>
                    <li>
                        { // Om ingen användare är inloggad visas länktext "Logga in". Om en användare är inloggad visas en "logga ut"-knapp. 
                            !user ? <NavLink className="header-link" to="/login">Logga in</NavLink> 
                            : 
                            <button id="logout-header" className="header-link" onClick={()=> {logout(); navigate("/"); }}>Logga ut</button> 
                        }
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
