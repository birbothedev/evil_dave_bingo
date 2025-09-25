import "../css/componentcss/SaboteurTaskList.css"

export function SaboteurTaskList({player}){

    const easyTasks = player.tasks.flatMap(group => group.easyTasks);
    const mediumTasks = player.tasks.flatMap(group => group.mediumTasks);
    const hardTasks = player.tasks.flatMap(group => group.hardTasks);

    return (
        <>
        <div className="player-tasks">
            <h3>{player.name}</h3>
            <div className="task-group">
                <div className="task-column">
                    <div className="task-header">Kinda Evil Tasks</div>
                    {easyTasks.map((task, i) => (
                        <div key={i} className="task-tiles">
                            {task.taskDescription}
                        </div>
                    ))}
                </div>
                <div className="task-column">
                    <div className="task-header">Evil Tasks</div>
                    {mediumTasks.map((task, i) => (
                        <div key={i} className="task-tiles">
                            {task.taskDescription}
                        </div>
                    ))}
                </div>
                <div className="task-column">
                    <div className="task-header">Totally Evil Tasks</div>
                    {hardTasks.map((task, i) => (
                        <div key={i} className="task-tiles">
                            {task.taskDescription}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    )
}
