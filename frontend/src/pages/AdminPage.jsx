import "../css/AdminPage.css"
import { InventoryBox } from "../components/InventoryBox"
import { StatusEffectBox } from "../components/StatusEffectBox"
import { useTeamFetch } from "../components/util/GlobalTeamFetch"

export function AdminPage(){

    const { teams, loading, error } = useTeamFetch();

    if (loading) return <div>Loading Admin Page...</div>
    if (error) return <div>{error}</div>

    return (
        <>
        <div className="admin-page">
            <h3 className="page-title">ADMIN HOME</h3>
            <div className="team-group-container">
                    {teams.map((team, index) => (
                        <div className="team-groups" key={index}>
                            <StatusEffectBox team={team} />
                            <InventoryBox team={team} />
                        </div>
                    ))}
            </div>
        </div>
        </>
    )
}