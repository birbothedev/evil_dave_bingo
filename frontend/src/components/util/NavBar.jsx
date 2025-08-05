import { Link } from "react-router-dom";
import "../../css/componentcss/NavBar.css"

export function NavBar(){
    return <nav className="navbar">
        <div className="navBarContainer">
            <Link to="/" className="nav-link">Home</Link>
        </div>
        <div className="navBarLinks">
            <Link to="/teampage" className="nav-link">Team</Link>
            <Link to="/adminpage" className="nav-link">Admin</Link>
        </div>
    </nav>
}