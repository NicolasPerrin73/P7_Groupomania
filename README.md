# P7_Groupomania

## Development environement
This project run with react, node.js, sass and MySql.

### How to run it?

#### Step 1:
Clone the repo
and open it on your IDE

#### Step 2:
 Create a .env file on the root of project
 
 Add variable like this:
 
 PORT="3001"
 
 MY_SQL_PASSWORD = "YOUR_SQL_ROOT_PASSWORD"
 
 TOKEN_KEY = "YOUR_SECRET_TOKEN_KEY"
 
 
 #### Step 3:
 Import SQL database you received on your SQL workbench (SQL file are not on this repo).

#### Step 4:
open the terminal from backend folder:

$ npm install

$ nodemon start


Backend server should start with this output:

Listening on port 3001

MySQl connected as id XX


#### Step 5:
open a new terminal from frontend folder:

$ npm install

$ npm start


React should run a server development on http://localhost:3000:

Open it on your browser to see the application.

#### Step 6:
open a new terminal from frontend folder:

$ npm run sass

Sass is now wachting modification.

Done!
