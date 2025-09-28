export async function fetchAllTeams(){
    const response = await fetch("/home-page-teams.json");
    if (!response.ok){
        throw new Error("Failed to fetch teams");
    }

    const data = await response.json();
    return data.teams;
}

export async function teamPageFetch(teamValue){
    console.log("Fetching team JSON:", `/${teamValue}-sample.json`);
    const response = await fetch(`/${teamValue}-sample.json`);
    if (!response.ok){
        throw new Error("Failed to fetch team!");
    }

    const data = await response.json();
    return data;
}
