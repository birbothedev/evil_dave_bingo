export async function fetchTeams(){
    const response = await fetch("/request-frontpage.json");
    if (!response.ok){
        throw new Error("Failed to fetch teams");
    }

    const data = await response.json();
    return data.teams;
}