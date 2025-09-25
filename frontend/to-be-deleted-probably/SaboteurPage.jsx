import "../css/SaboteurPage.css"
import { useState, useEffect } from "react"
import { fetchEvilTasks } from "../services/api";
import { SaboteurTaskList } from "./SaboteurTaskList";


export function SaboteurPage(){
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() =>{
        async function getData() {
            try {
                const taskData = await fetchEvilTasks()
                setTasks(taskData)
            } catch (err) {
                console.error(err)
                setError("Failed to load tasks")
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [])

    if (loading) return <div>Loading Tasks...</div>
    if (error) return <div>{error}</div>

    return (
        <>
        <div className="saboteur-page">
            <h3 className="page-title">SABOTEUR HOME</h3>
            <div className="sab-boards-container">
                {tasks.map((player, index) => (
                    <div className="team-groups" key={index}>
                        <SaboteurTaskList player={player}/>
                    </div>
                ))}
            </div>
        </div>
        </>
    )
}