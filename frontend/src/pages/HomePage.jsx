import { BingoBoard } from "../components/BingoBoard";
import { CollapsibleSection } from "../components/util/Collapsible";
import "../css/HomePage.css"
import { useState } from "react";

export function HomePage(){
    //placeholder variables to call each team from the backend
    //will probably end up creating a map to call a dynamic number of teams but this works for now xd
    const team1=""
    const team2=""
    const team3=""
    const team4=""
    const team5=""
    const team6=""

    return (
        <div className="home-page">
            <h3>EVIL DAVE'S TOTALLY EVIL BINGO EVENT</h3>
            <div className="collapsible-buttons">
                <CollapsibleSection label="Button 1">
                    <p>Button 1 text.</p>
                </CollapsibleSection>
            </div>
            <div className="bingo-container">
                <BingoBoard team={team1}/>
                <BingoBoard team={team2}/>
                <BingoBoard team={team3}/>
                <BingoBoard team={team4}/>
                <BingoBoard team={team5}/>
                <BingoBoard team={team6}/>
            </div>
        </div>
    );
}