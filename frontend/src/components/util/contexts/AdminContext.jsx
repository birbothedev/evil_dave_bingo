import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { adminFetch } from "../../../services/api"


const AdminContext = createContext()

export function AdminFetch({ children }){
    const navigate = useNavigate()

    const [admin, setAdmin] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        async function loadAdmin() {
            try {
                const adminData = await adminFetch()
                if (!adminData){
                    setAuthorized(false)
                    navigate(`/pageauth/admin`)
                    return
                }
                setAdmin(adminData)
            } catch (err){
                console.log(err)
                setError("Failed to load admin data")
            } finally {
                setLoading(false)
            }
        }

        loadAdmin()
    }, [])

    return (
        <AdminContext.Provider value = {{ admin, loading, error, authorized }}>
            {children}
        </AdminContext.Provider>
    )
}

export function loadAdminData() {
    return useContext(AdminContext)
}