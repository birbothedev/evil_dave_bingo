
import { createContext, useContext, useState } from "react"

const PageAuthContext = createContext()

export function PageAuth({children}){
    const [wrongPass, setWrongPass] = useState(false)
    const [authorizedTeam, setAuthorizedTeam] = useState(false)
    const [authorizedAdmin, setAuthorizedAdmin] = useState(false)
    const [wrongPassTeam, setWrongPassTeam] = useState(false)
    const [wrongPassAdmin, setWrongPassAdmin] = useState(false)
    
    async function authenticatePassphrase(passphrase, page) {
        try {
            const response = await fetch(`https://api.evildavebingo.com/authenticate/${passphrase}/`, {
                method: "POST",
                credentials: "include",
            })
            if (!response.ok) {
            if (page === "teampage") {
                setWrongPassTeam(true)
                setAuthorizedTeam(false)
            }
            if (page === "adminpage") {
                setWrongPassAdmin(true)
                setAuthorizedAdmin(false)
            }
                return false
            }

            if (page === "teampage") {
                setWrongPassTeam(false)
                setAuthorizedTeam(true)
            }
            if (page === "adminpage") {
                setWrongPassAdmin(false)
                setAuthorizedAdmin(true)
            }

        } catch(err) {
            setWrongPass(true)
            if (page === "teampage") setAuthorizedTeam(false)
            if (page === "adminpage") setAuthorizedAdmin(false)
            return false
        }
    }

    return (
        <PageAuthContext.Provider value = {{ authenticatePassphrase, authorizedTeam, authorizedAdmin, wrongPassTeam, wrongPassAdmin }}>
            {children}
        </PageAuthContext.Provider>
        
    )
}

export function usePageAuth(){
    return useContext(PageAuthContext)
}