import { useParams, useNavigate } from "react-router-dom"
import "../../css/componentcss/PageAuth.css"
import { useState } from "react"


export function PageAuth(){
    const { page } = useParams() // either "team" or "admin" based on which link was clicked
    const navigate = useNavigate()

    const [passcode, setPasscode] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        try {
            const response = await fetch(`https://api.evildavebingo.com/authenticate/${passcode}`, {
                method: "POST",
                credentials: "include",
            })
            if (!response.ok) {
                throw new Error("Invalid login phrase")
            }

            console.log("Navigating to admin")
            // navigate("/adminpage")

            const data = await response.json()
            if (page === "team") {
                navigate(`/teampage/${data.team}`)
            } else if (page === "admin") {
                navigate("/adminpage")
            }
        } catch(err) {
            setError(err.message)
        }
    }

    return (
        <div className="password-page">
            <div className="password-container">
                <h3 className="passphrase-title">Enter Passphrase:</h3>
                <form onSubmit={handleSubmit}>
                    <input className="input-container"
                        type="password"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Passphrase"
                    />
                </form>
            </div>
        </div>
    )
}
