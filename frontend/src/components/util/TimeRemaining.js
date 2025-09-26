export function getTimeRemaining(useBefore) {
    const now = Date.now() / 1000;
    console.log("useBefore:", useBefore, "now:", now);

    const secondsLeft = Math.max(0, Math.floor(useBefore - now));
    console.log("secondsLeft:", secondsLeft);
    
    const days = String(Math.floor(secondsLeft / 86400)).padStart(2, "0");
    const hours = String(Math.floor((secondsLeft % 86400) / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");

    return (`${days}d ${hours}h ${minutes}m`).toLowerCase();
}