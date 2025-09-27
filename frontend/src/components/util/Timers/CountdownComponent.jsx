import { use } from "react";
import { useCountdownEffect } from "./UseCountdownEffect";


export function CountdownComponent({useBy}) {
    const timeRemaining = useCountdownEffect(useBy)

    return (
        <div className="time-remaining">
            {timeRemaining}
        </div>
    )
}