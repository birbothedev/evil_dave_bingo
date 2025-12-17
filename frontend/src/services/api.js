export async function fetchAllTeams(){
    const response = await fetch("/EvilDave.teams.json", {
        method: "GET",
    });
    if (!response.ok){
        throw new Error("Failed to fetch teams");
    }

    const data = await response.json();
    return data;
}

export async function getNews(){
    const response = await fetch("https://api.evildavebingo.com/news/", {
        method: "GET"
    });

    if (!response.ok){
        throw new Error ("Not authenticated or invalid data")
    }
    const data = await response.json();
    return data;
}

export async function getSingleTeam(){
    const response = await fetch("/EvilDave.teams.json",  {
        method: "GET",
    });
    if (!response.ok){
        throw new Error("Failed to fetch team");
    }

    const data = await response.json();

    const filteredteam = data.filter(team => team.name === "CregsList");
    return filteredteam;
}