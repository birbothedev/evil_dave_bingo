import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const AdminContext = createContext()

export function AdminFetch({ children }){
    const navigate = useNavigate()

    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadAdmin() {
            try {
                const response = await fetch(`https://api.evildavebingo.com/admin/`, {
                    method: "GET",
                    credentials: "include"
                })
                if (!response.ok){
                    navigate(`/pageauth/adminpage`)
                    return
                }
                const adminData = await response.json()
                console.log("AdminFetch response", adminData)
                if (!adminData){
                    navigate(`/pageauth/admin`)
                    return
                }
                setAdmin(adminData)
            } catch (err){
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadAdmin()
    }, [])

    return (
        <AdminContext.Provider value = {{ admin, loading, error }}>
            {children}
        </AdminContext.Provider>
    )
}

export function loadAdminData() {
    return useContext(AdminContext)
}