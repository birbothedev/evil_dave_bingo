
import { createContext, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

const PageAuthContext = createContext()

export function PageAuth({children}){
    const [wrongPass, setWrongPass] = useState(false)
    const [wrongPassTeam, setWrongPassTeam] = useState(false)
    const [wrongPassAdmin, setWrongPassAdmin] = useState(false)
    const navigate = useNavigate()
    
    async function authenticatePassphrase(passphrase, page) {
        try {
            const response = await fetch(`https://api.evildavebingo.com/authenticate/${passphrase}/`, {
                method: "POST",
                credentials: "include",
            })
            if (!response.ok) {
                if (page === "teampage") {
                    setWrongPassTeam(true)
                }
                if (page === "adminpage") {
                    setWrongPassAdmin(true)
                }
                return false
            }

            if (page === "teampage") {
                setWrongPassTeam(false)
                navigate('/teampage')
            }
            if (page === "adminpage") {
                setWrongPassAdmin(false)
                navigate('/adminpage')
            }

        } catch(err) {
            setWrongPass(true)
            return false
        }
    }

    return (
        <PageAuthContext.Provider value = {{ authenticatePassphrase, wrongPassTeam, wrongPassAdmin }}>
            {children}
        </PageAuthContext.Provider>
        
    )
}

export function usePageAuth(){
    return useContext(PageAuthContext)
}