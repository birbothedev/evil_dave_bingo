import { useParams, useNavigate } from "react-router-dom"
import "../../css/componentcss/PageAuth.css"
import { useState } from "react"


export function PageAuth(){
    const { page } = useParams() //either "team" or "admin" based on which link was clicked
    const navigate = useNavigate()

    const [passcode, setPasscode] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        let foundTeam = null

        if (page === "team") {
            if (passcode === "team1") foundTeam = "team1"
            else if (passcode === "team2") foundTeam = "team2"
            else if (passcode === "team3") foundTeam = "team3"

            if (foundTeam) {
                console.log("foundTeam:", foundTeam)
                navigate(`/teampage/${foundTeam}`)
            } else {
                alert("Incorrect Passcode")
            }
        } else if (page === "admin") {
            if (passcode === "adminPass") {
                navigate("/adminpage")
            } else {
                alert("Incorrect Passcode")
            }
        }

        console.log("Passcode entered:", passcode)
    }

    return (
        <div className="password-page">
            <div className="password-container">
                <h3 className="passphrase-title">Enter Passphrase:</h3>
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
