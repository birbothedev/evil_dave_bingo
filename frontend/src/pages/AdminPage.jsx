import "../css/AdminPage.css"
import { InventoryBox } from "../components/InventoryBox"
import { StatusEffectBox } from "../components/StatusEffectBox"
import { useNavigate } from "react-router-dom"
import { loadAdminData } from "../components/util/contexts/AdminContext"
import { adminFetch } from "../services/api"

export function AdminPage(){
    const navigate = useNavigate()
    // const { admin, loading, error, authorized } = loadAdminData()

    const data = adminFetch()

    // if (loading) return <div>Loading Admin Page...</div>
    // if (error) return <div>{error}</div>
    // if (!admin) return <div>No admin data</div>

    // if (!authorized){
    //     navigate("/pageauth/team")
    // }

    return (
        <>
        <div className="admin-page">
            <h3 className="page-title">ADMIN HOME</h3>
            <div className="team-wrapper">
                <div className="team-group-container">
                    {/* {teams.map((team, index) => (
                        <div className="team-groups" key={index}>
                            <StatusEffectBox team={team} />
                            <InventoryBox team={team} />
                        </div>
                    ))} */}

                    team groups
                </div>
            </div>
        </div>
        </>
    )
}