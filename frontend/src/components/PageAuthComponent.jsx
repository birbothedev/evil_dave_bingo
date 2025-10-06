import { useState } from "react"
import "../css/componentcss/PageAuth.css"
import { usePageAuth } from "./util/contexts/PageAuthContext"
import { useParams } from "react-router-dom"

export function PageAuthComponent(){
    const { page } = useParams()
    const [passphrase, setPassphrase] = useState("")
    const { authenticatePassphrase, wrongPassTeam, wrongPassAdmin } = usePageAuth()

    async function handleSubmit(e) {
        e.preventDefault();
        await authenticatePassphrase(passphrase, page)
    }

    return (
        <div className="password-page">
            <div className="password-container">
                <h3 className="passphrase-title">
                    {
                        page === "teampage" ? (
                            "Enter Team Passphrase:"
                        ) : (
                            "Enter Admin Passphrase:"
                        )
                    }
                </h3>
                <form onSubmit={handleSubmit}>
                    <input className="input-container"
                        type="password"
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                        placeholder="Passphrase"
                    />
                </form>
                {page === "adminpage" && wrongPassAdmin && (
                    <h3 className="passphrase-title">nice try buddy</h3>
                )}
                {page === "teampage" && wrongPassTeam && (
                    <h3 className="passphrase-title">Incorrect Password</h3>
                )}
            </div>
        </div>
    )
}