export function Logout(){
    async function handleLogout(){
        await fetch("https://api.evildavebingo.com/authenticate/logout/", {
            method: "POST",
            credentials: "include"
        })
    }

    return (
        <button className="nav-link" onClick={handleLogout}>Logout</button>
    )
}