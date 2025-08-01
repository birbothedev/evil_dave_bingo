import { BingoBoard } from "../components/BingoBoard";
import { SmallBingoBoard } from "../components/SmallBingoBoard";
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
            <h3>EVIL DAVE'S TOTALLY EVIL BINGO EVENT</h3>
            {/* <div className="collapsible-buttons">
                <CollapsibleSection label="Button 1">
                    <p>Button 1 text.</p>
                </CollapsibleSection>
            </div> */}
            <div className="bingo-container">
                <SmallBingoBoard team={team1} />
                <SmallBingoBoard team={team2} />
                <SmallBingoBoard team={team3} />
                <SmallBingoBoard team={team4} />
                <SmallBingoBoard team={team5} />
                <SmallBingoBoard team={team6} />
            </div>
        </div>
    );
}