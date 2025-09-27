import { useState, useEffect } from 'react'
import { getTimeRemaining } from "./TimeRemaining.js"

export function useCountdownEffect(object){
    const [timeLeft, setTimeLeft] = useState([])

    //update time once upon load and then once every 60 seconds
    useEffect(() => {
        const update = () => setTimeLeft(getTimeRemaining(object))
        update()

        const interval = setInterval(update, 60000)

        return () => clearInterval(interval)
    }, [object])

    return timeLeft;
}