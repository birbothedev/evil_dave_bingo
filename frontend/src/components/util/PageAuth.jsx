import { useParams, useNavigate } from "react-router-dom";
import { useTeamFetch } from "./GlobalTeamFetch";
import "../../css/componentcss/PageAuth.css"
import { useState } from "react"


export function PageAuth(){
    const { page } = useParams(); //either "team" or "admin" based on which link was clicked
    const navigate = useNavigate();

    const [authorized, setAuthorized] = useState(false)
    const [passcode, setPasscode] = useState("")
    const [team, setTeam] = useState(null)

    const { teams, loading, error } = useTeamFetch();
    if (loading) return <div>Loading Teams...</div>
    if (error) return <div>{error}</div>


    const handleSubmit = (e) => {
        e.preventDefault();

        if (page === "team") {
            // this will have to be changed when we pull from server
            const foundTeam = teams.find(team => team.passcode === passcode)

            if (foundTeam){
                setAuthorized(true)
                setTeam(foundTeam)
                console.log("found team " + foundTeam.name)
                
                navigate("/teampage", { state: { team: foundTeam }});
            } else {
                alert("Incorrect Passcode")
            }
        } else if (page === "admin") {
            if (passcode === "adminPass"){
                setAuthorized(true)
                navigate("/adminpage");
            } else {
                alert("Incorrect Passcode")
            }
        }
    }

    return (
        <div className="password-page">
            <div className="password-container">
                <h3>Enter Passphrase:</h3>
                <form onSubmit={handleSubmit}>
                    <input className="input-container"
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Passphrase"
                    />
                </form>
            </div>
        </div>
    )
}
