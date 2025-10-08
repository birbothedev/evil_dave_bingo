import "../css/AdminPage.css"
import { loadAdminData } from "../components/util/contexts/AdminContext"
import { InventoryBox } from "../components/InventoryBox"
import { StatusEffectBox } from "../components/StatusEffectBox"
import { SmallBingoBoard } from "../components/SmallBingoBoard"

export function AdminPage(){
    const { admin, loading, error } = loadAdminData()

    if (loading) return <div>Loading Admin Page...</div>
    if (error) return <div>{error}</div>
    if (!admin) return <div>No admin data</div>

    // console.log("loading", loading, "admin", admin, "error", error)


    return (
        <div className="admin-page">
            <h3 className="page-title">ADMIN HOME</h3>
            <div className="team-wrapper">
                <div className="team-group-container">  
                    {admin.slice(1).map((team) => (
                        <div className="team-groups" key={team._id}>
                            <h3 className="board-title"> {team.name}</h3>
                            <SmallBingoBoard team={team} page={"admin"}/>
                            <InventoryBox team={team} />
                            <StatusEffectBox team={team} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}