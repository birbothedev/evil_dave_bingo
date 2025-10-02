import { useParams, useNavigate } from "react-router-dom"
import "../../css/componentcss/PageAuth.css"
import { useState } from "react"

export function PageAuth(){
    const { page } = useParams() // either "team" or "admin" based on which link was clicked
    const navigate = useNavigate()

    const [passcode, setPasscode] = useState("")
    const [error, setError] = useState("")
    const [wrongPass, setWrong] = useState(false)
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setWrong(false)

        try {
            const response = await fetch(`https://api.evildavebingo.com/authenticate/${passcode}/`, {
                method: "POST",
                credentials: "include",
            })
            if (!response.ok) {
                setWrong(true)
                return
            }

            const data = await response.json()
            if (page === "teampage") {
                navigate(`/teampage`)
            } else if (page === "adminpage") {
                navigate("/adminpage")
            }
        } catch(err) {
            setError(err.message)
        }
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
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        placeholder="Passphrase"
                    />
                </form>
                {
                    page == "adminpage" && wrongPass &&
                    (
                        <h3 className="passphrase-title">
                            nice try buddy
                        </h3>
                    )
                }
                {
                    page == "teampage" && wrongPass &&
                    (
                        <h3 className="passphrase-title">
                            Incorrect Password
                        </h3>
                    )
                }
            </div>
        </div>
    )
}
