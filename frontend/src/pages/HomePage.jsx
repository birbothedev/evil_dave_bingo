import { BingoBoard } from "../components/BingoBoard";
import { SmallBingoBoard } from "../components/SmallBingoBoard";
import { TeamPoints } from "../components/TeamPoints";
import { CollapsibleSection } from "../components/util/Collapsible";
import "../css/HomePage.css"
import { useState } from "react";

export function HomePage(){
    //placeholder variables to call each team from the backend
    //will probably end up creating a map to call a dynamic number of teams but this works for now xd
    const team1="Team1"
    const team2="Team2"
    const team3="Team3"
    const team4="Team4"
    const team5="Team5"
    const team6="Team6"

    return (
        <div className="home-page">
            <h3 className="page-title">EVIL DAVE'S TOTALLY EVIL BINGO EVENT</h3>
            <div className="bingo-container">
                <div className="team-groups">
                    <SmallBingoBoard team={team1} />
                </div>
                <div className="team-groups">
                    <SmallBingoBoard team={team2} />
                </div>
                <div className="team-groups">
                    <SmallBingoBoard team={team3} />
                </div>
                <div className="team-groups">
                    <SmallBingoBoard team={team4} />
                </div>
                <div className="team-groups">
                    <SmallBingoBoard team={team5} />
                </div>
                <div className="team-groups">
                    <SmallBingoBoard team={team6} />
                </div>
            </div>
        </div>
    );
}