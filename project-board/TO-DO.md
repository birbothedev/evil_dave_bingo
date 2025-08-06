
# Frontend
## Clean Up
- ~~remove colored outlines for debugging css`~~
- resizing for mobile screens?
- ~~figure out a way to combine BingoBoard and SmallBoard components into one component to reduce redundancy ~~ just using the small board component
  - ~~~~take a size paramter into the component function and use it to dynamically change class name to the bigger/smaller size depending on use case?~~ using onclick function for this
- ~~change css styling of NavBar ~~
- decide on overall styling of the page
  - color schemes, look of boards/etc
## Team Page
- ~~add team's bingo board~~
  - ~~use state management to update board on home page and team page at the same time?~~ using the same component for both so it will already be connected
- ~~add inventory management box~~
- ~~add status effect box~~
- ~~decide how to pull data~~ pull each team in the main app and send that information to each page so entire site is updated at the same time ?
- add a component for the pre-declared bingo board to show what bingo the team is currently working on
## Home Page
- ~~make a more dynamic mapping system so we dont have 36 hardcoded tiles for each bingo board~~
- ~~expand team boards on click~~
- functionality for colored tiles on the small board based on what tiles are marked completed 
  - ~~figure out skeleton functionality before pulling data~~
## Admin Page
- overall goal: display all team inventories
  - display all team boards? might not be needed if we see them all on the home page
- make buttons auto close when the other is clicked


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