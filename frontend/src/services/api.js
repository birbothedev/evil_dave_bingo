export async function fetchAllTeams(){
    const response = await fetch("https://api.evildavebingo.com/home/", {
        method: "GET",
    });
    if (!response.ok){
        throw new Error("Failed to fetch teams");
    }

    const data = await response.json();
    return data.teams;
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
