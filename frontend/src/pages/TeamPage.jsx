import { InventoryBox } from "../components/InventoryBox"
import { SmallBingoBoard } from "../components/SmallBingoBoard"
import { StatusEffectBox } from "../components/StatusEffectBox"
import { useTeamFetch } from "../components/util/GlobalTeamFetch";
import "../css/TeamPage.css"
import { useState } from "react"


export function TeamPage(){
    const [authorized, setAuthorized] = useState(false)
    const [passcode, setPasscode] = useState("")
    const [team, setTeam] = useState(null)

    const { teams, loading, error } = useTeamFetch();
    if (loading) return <div>Loading Teams...</div>
    if (error) return <div>{error}</div>


    const handleSubmit = (e) => {
        e.preventDefault();

        // this will have to be changed when we pull from server
        const foundTeam = teams.find(team => team.passcode === passcode)

        if (foundTeam){
            setAuthorized(true)
            console.log("found team " + foundTeam.name)
            setTeam(foundTeam)
        } else {
            alert("Incorrect Passcode")
        }
    }

    if (!authorized || !team) {
        return (
            <div className="password-page">
                <div className="password-container">
                    <h3>Enter Team Passphrase:</h3>
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

    return (
        <>
        <div className="team-page-wrapper">
            <h3 className="page-title">THIS IS TEAM {team.name}'s HOME PAGE</h3>
            <div className="team-columns">
                <div className="team-bingo-board">
                    <SmallBingoBoard team={team}/>
                </div>
                <div className="team-inventory-container">
                    <div className="inventory-box">
                        <InventoryBox team={team}/>
                    </div>
                    <div className="status-box">
                        <StatusEffectBox team={team}/>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}