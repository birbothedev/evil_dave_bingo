export function Logout({ onLogout }){
    async function handleLogout(){
        await fetch("https://api.evildavebingo.com/authenticate/logout", {
            method: "POST",
            credentials: "include"
        })
        onLogout()
    }

    return (
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
    )
}