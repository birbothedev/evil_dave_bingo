import { use } from "react";
import { useCountdownEffect } from "./UseCountdownEffect"


export function CountdownComponent({useBy, component}) {
    const timeRemaining = useCountdownEffect(useBy, component)

    return (
        <div className="time-remaining">
            {timeRemaining}
        </div>
    )
}