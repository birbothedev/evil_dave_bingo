import { Link } from "react-router-dom"
import "../../css/componentcss/NavBar.css"
import { Logout } from "./Logout"

export function NavBar(){
    return (
        <div className="navbar-component"> 
            <nav className="navbar">
                <div className="navBar-container">
                    <Link to="/" className="nav-link">Home</Link>
                </div>
                <div className="navBar-links">
                    {/* <Logout /> */}
                    <Link to="teampage" className="nav-link">Team</Link>
                    <Link to="adminpage" className="nav-link">Admin</Link>
                </div>
            </nav>
        </div>
    )
}