import { Link } from "react-router-dom";
import "../../css/componentcss/NavBar.css"

export function NavBar(){
    return (
        <div className="navbar-component"> 
            <nav className="navbar">
                <div className="navBar-container">
                    <Link to="/" className="nav-link">Home</Link>
                </div>
                <div className="navBar-links">
                    {/* <Link to="/saboteurpage" className="nav-link">Saboteur</Link> */}
                    <Link to="/pageauth/team" className="nav-link">Team</Link>
                    <Link to="/pageauth/admin" className="nav-link">Admin</Link>
                </div>
            </nav>
        </div>
    )
}