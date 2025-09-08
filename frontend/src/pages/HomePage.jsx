import { SmallBingoBoard } from "../components/SmallBingoBoard";
import "../css/HomePage.css"
import { useTeamFetch } from "../components/util/GlobalTeamFetch";

export function HomePage(){

    const { teams, loading, error } = useTeamFetch();

    if (loading) return <div>Loading Teams...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="home-page">
            <h2 className="page-title">EVIL DAVE'S TOTALLY EVIL BINGO EVENT</h2>
            <div className="bonus-mission-container">
                <h3 className="bonus-mission-title">Bonus Missions:</h3>
                <div className="bonus-mission-desc-and-reward-wrapper">
                    <h3 className="bonus-mission-description">This is a description of the bonus mission</h3>
                    <h3 className="bonus-mission-reward">Reward</h3>
                </div>
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