import "../css/AdminPage.css"
import { InventoryBox } from "../components/InventoryBox"
import { StatusEffectBox } from "../components/StatusEffectBox"
import { loadAdminData } from "../components/util/contexts/AdminContext"
import { usePageAuth } from "../components/util/contexts/PageAuthContext"
import { PageAuthComponent } from "../components/PageAuthComponent"

export function AdminPage(){
    const { authorizedAdmin } = usePageAuth()
    const { admin, loading, error } = loadAdminData()

    if (!authorizedAdmin) return <PageAuthComponent page={"adminpage"}/>

    if (loading) return <div>Loading Admin Page...</div>
    if (error) return <div>{error}</div>
    if (!admin) return <div>No admin data</div>

    return (
        <div className="admin-page">
            <h3 className="page-title">ADMIN HOME</h3>
            <div className="team-wrapper">
                <div className="team-group-container">  
                    {admin.map((team) => (
                        <div className="team-groups" key={team._id}>
                            <h3 className="board-title"> {team.name}</h3>
                            <InventoryBox team={team} />
                            <StatusEffectBox team={team} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}