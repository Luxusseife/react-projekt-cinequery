import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Footer.css";

const Footer = () => {

    // Använder användaruppgifter och logga ut-funktion från contextet.
    const { user, logout } = useAuth();

    return (
        <>
            <footer>
                <nav>
                    <ul className="footer-menu">
                        <li><NavLink className="footer-link" to="/">Hem</NavLink></li>
                        <li><NavLink className="footer-link" to="/mypage">Min sida</NavLink></li>
                        <li>
                            { // Om ingen användare är inloggad visas länktext "Logga in". Om en användare är inloggad visas en "logga ut"-knapp. 
                                !user ? <NavLink className="footer-link" to="/login">Logga in</NavLink> : <button id="logout-footer" className="footer-link" onClick={logout}>Logga ut</button>
                            }
                        </li>
                    </ul>
                </nav>

                <p className="copyright">&copy; 2025 Jenny Lind</p>
            </footer>
        </>
    )
}

export default Footer
