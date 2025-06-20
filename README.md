## DESCRIPTION
A scalable web app for exploring and editing Formula 1 data from Kaggle. It includes a Go tool to convert CSV files to a SQLite database, a FastAPI backend API for data access and editing, and a Next.js frontend with searchable tables, sorting, and embedded maps. Designed with clean separation of concerns, state management via URL, and easy setup. Future plans include authentication, real-time updates, and AI-assisted data parsing.

## USAGE ( windows )
1. Create the database from csv files:
- (download formel1 data from kaggle; see link below under SOURCES)
- convert csv files to database with the csv-to-sql tool.
    $ create_db.exe <csv-files-folder> <database-name>
- make sure database file is called "formel1.db"
- pass the db to "fastapi-db/data"

2. install the database API and run it:

- navigate to "fastapi-db" folder
    $ cd fastapi-db
- make sure python3  is installed
- setup an python environment in the folder:
    $ python -m venv .venv
- make sure environment is activated. run the activate.bat file
    $ activate
- install all dependencies of the back-end:
    $ pip install -r requirements.txt
- run the back-end by calling run.bat
    $ run

3. install and run the nextjs app ( SPA front-end ): 

- navigate to the "nextjs-app" folder:
    $ cd nextjs-app
- make sure nodejs is installed ( I used 22.16.0 )
- install dependencies
    $ npm install
- run the front-end server:
    $ npm run dev 


## CONTENT

- csv to sqlite tool in go
- db-api und UI getrennte Projekte und skalierbar organisiert.
- editerbare Daten
- State Management via URL
- proxy setup for api ( next.config) for dev-environment to solve CORS problem
- use of enums
- select shown columns
- sorting
- auto scrolling to selected entry
- function to find picture from wiki page
- embeded google maps to show locations if coordinates are given
- ...


## SOURCES
- Database (csv files)
https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020?resource=download

- Tailwind components:
Table: https://tailwindflex.com/@lukas-muller/table-template
Search input : https://www.creative-tim.com/twcomponents/component/search-input-with-integrated-icon-and-button


## TODOS:
- use .env files for config
- login and session token creation
- better performance: only visible rows; checking every trigger of rerender
- websocket for update events
- use correct relation and set primary and foreign keys
- parse csv files with AI to create the correct primary and foreign keys and use correct column types
- reasonable organisation in one git repo
- write an install script
- convert all scripts to sh scripts
- limit API response to 100-500 entries 
- ...



## requirements.txt erstellen
$ pip freeze > requirements.txt




