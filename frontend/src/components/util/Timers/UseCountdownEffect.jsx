import { useState, useEffect } from 'react'
import { getTimeRemaining, timeAgo } from "./TimeRemaining.js"

export function useCountdownEffect(object, component){
    const [timeLeft, setTimeLeft] = useState([])

    //update time once upon load and then once every 60 seconds
    useEffect(() => {
        let update

        if (component==="news"){
            update = () => setTimeLeft(timeAgo(object))
        } else if (component==="bonus mission"){
            update = () => setTimeLeft(getTimeRemaining(object))
        } else {
            return
        }
        update()
        const interval = setInterval(update, 60000)
        return () => clearInterval(interval)
    }, [object, component])

    return timeLeft;
}