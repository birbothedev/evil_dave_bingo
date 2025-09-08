import { SmallBingoBoard } from "../components/SmallBingoBoard";
import "../css/HomePage.css"
import { useTeamFetch } from "../components/util/GlobalTeamFetch";
import { BonusMissionComponent } from "../components/BonusMissionComponent";

export function HomePage(){

    const { teams, loading, error } = useTeamFetch();

    if (loading) return <div>Loading Teams...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="home-page">
            <h2 className="page-title">EVIL DAVE'S TOTALLY EVIL BINGO EVENT</h2>
            <div className="bonus-missions-home-page">
                <BonusMissionComponent />
            </div>
            <div className="bingo-container">
                {teams.map((team, index) => (
                    <div className="team-groups" key={index}>
                        <SmallBingoBoard team={team} />
                    </div>
                ))}
            </div>
        </div>
    );
}