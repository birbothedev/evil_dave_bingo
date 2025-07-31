
# Frontend
## Clean Up
- remove colored outlines for debugging css
- resizing for mobile screens?
## Team Page
- add team's bingo board
  - use state management to update board on home page and team page at the same time?
- add inventory management box
- add status effect box
## Home Page
- make a more dynamic mapping system so we dont have 36 hardcoded tiles for each bingo board
- dynamic team pulling from backend rather than hardcoded placeholder teams



# Backend
## Figure out data structure
- Json?
- Should we compartmentalize the data based on request?

## Create API Endpoints
- /home
  - get all boards
  - get all items, icons

- /team?={teamPhrase}
  - get team board
  - get team inventory
  - get team active board effects
  
- /admin *authed*
  - get all teams
  - get all items, icons
  - get all active effects
  - get all boards
  - get all users
  - Dashboard

- /tasks?={evilPhrase}
  - get team assigned evil tasks

# Discord




# Miscellaneous