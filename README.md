# TASK MANAGEMENT APP USING ZOHO CATALYST

## Table of Contents
- [Progress Achieved](#progress-achieved)
- [Documentation](#documentation)
  - [Design](#design)
  - [How to Replicate](#how-to-replicate)
  - [The Schema](#the-schema)
  - [The Backend](#the-backend)
    - [API Routes](#api-routes)
    - [Middlewares](#middlewares)
    - [Services](#services)
  - [The Frontend](#the-frontend)
  - [Problems](#problems)
  - [Ending Notes](#ending-notes)

## Progress Achieved
- [ ] Frontend: React + TypeScript
- [x] Backend: NodeJS + ZOHO Catalyst deployment
- [x] Data Storage on ZOHO ZCQL
- [x] Hosting Backend on ZOHO Catalyst
- [ ] Finishing the frontend 
- [x] Hosting Frontend on ZOHO Catalyst
- [ ] Bonus points

## Documentation
### Design
- The monorepo type architecture, using AppSail for hosting server, Web Client Hosting for hosting the frontend
- For GIT, the main branch is `main`, and there are `feat/feature` branches for development
> I chose AppSail for the backend server and not functions because functions would be more ideal for eventful tasks like notifications. But for a persistent server like need AppSail is better. 
- The `BACKEND` code is located in the `root/backend` folder
- The `FRONTEND` using React + TypeScript, inside the `root/frontend` folder, it builds the project and outputs the files inside the `/root/client` directory
> (catalyst by default provies Create React App (depricated), Angular, Basic Web App options, and I wanted to use ReactTS + Vite, also had issues with max files upload on deploy so chose to split into 2 dirs)

### How to Replicate
- Run Dev server for backend
```
root/backend > npm install
root/backend > npm run dev
```
- Deploy backend on Catalyst AppSail
```
root > catalyst deploy --only appsail
```
- Run Frontend Dev Server 
```
root/frontend > npm install
root/frontend > npm run dev
```
- Build and Deploy Frontend on Catalyst Web Client Hosting
```
root/frontend > npm run build
root > catalyst deploy --only client
```

### The Schema
`Tasks Table`
| Row Name | type | default | constraint |
| -------- | ----- | --- | -- |
| id  | ROWID | auto | primary key |
| author | varchar(120) | - | foreign key |
| title | text | - | not null |
| description | text | - | - |
| pending | boolean | false | - |

![image](https://github.com/user-attachments/assets/7058b0b5-21e2-43a5-8143-1ff326e4ffbf)


`Users Table`
| Row Name | type | default | constraint |
| -------- | ----- | --- | -- |
| id  | ROWID | auto | primary key |
| email | varchar(120) | - | unique |
| password | - | - | not null |

![image](https://github.com/user-attachments/assets/40832980-6523-4adf-89df-f5489a8fdabc)

### The Backend
- The backend is a `ExpressJS` server hosted on `ZOHO's Serverless AppSail service`
- The database is a `ZOHO Catalyst ZCQL` 
- The authentication was setup with `email/password` + `ZOHO`, `GOOGLE OAuth providers` -> but I had issues here explained here
- Other auth service is in house `JWT authentication` with email and password
- Using `JWT` for json web token auth, `bcrypt` to hash passwords

#### API Routes
- `/users` - login / signup
    - `POST: /users/login` - checks user `email` and `password` from `users` table, compares hash if true, signs and returns a `jwt singed token` for authorization
    - `POST: /users/signup` - checks if a user with `email` already exists, if not, hashes the password, creates a new user in the `users` table 
- `/tasks` - create / read / update / delete (protected / authorization token needed)
    - `GET: /tasks`- gets all the tasks authored by the user with email - `email`:  is appended by middleware
    - `POST: /tasks` - creates a new task in the `tasks` table, sets author = `user.email`, `title`, `description`, `pending: false`
    - `UPDATE: /tasks/:taskID` - updates a task with `taskId`, `author = user.email` in the tasks table 
    - `DELETE: /tasks/:taskID` - deletes a task with `taskId`, `author = user.email` in the tasks table

#### Middlewares
- `authorization middleware` - checks if the request comes with a `token: token` attached in it's `headers`, verifies if it is legible and then forwards request to the `next()` handler

#### Services
- user-services:
    - `async function getUser(req)` - gets user with `req.body.email` from `users` table
    - `async function createUser(req)` - creates a new user with `req.body.email`, `hash(req.body.passord)` in the `users` table
- task-services:
    - `async function get_tasks(req)` - gets all the tasks authored by user with `email =  req.body.email`
    - `async function update_task(req)` - updates the row in tasks table authored by user with `email =  req.body.email` and `taskID = req.body.taskID`, with `description = req.body.description`, `status = req.body.status`
    - `async function delete_task(req)` - deletes a row in tasks table authored by user with `email =  req.body.email`, and `taskID = req.body.taskID`
    - `async function post_task(req)` - creates a new row in tasks table authored by user with `email =  req.body.email`, and `taskID = req.body.taskID` with `(title = req.body.title`, `description = req.body.description`, `status = req.body.status)`
- utils:
    - `function escapeSingleQuotes(value)`: ZOHO's ZCQL queries need the strings to be in single quotes, in nodeJS `${value}` by default would use "", this function solves that issue
    - `async function generate_hash(payload)` : generates a hash for the payload using `bcrypt` library
    - `async function verify_hash(payload, target)`: compares a target hash value and a payload hash value

### The Frontend
- Made with ReactTS + Vite + Tailwind CSS
- Runs and is deployed
- But is incomplete - only signup/login pages were designed
- Got stuck whilst building `:(` 

### Problems 
- I was trying to code the server with `TypeScript` but the Catalyst Initialization function `const app = catalyst.initialize(req);` had issues with the compilation when passing the `Request<>` object, after trying to look for a solution for hours, and going through ZOHO's documentation, I couldn't find a fix, so had to start with `NodeJS`
- `BUG in ZOHO's ZCQL`: I had turned on the indexing on the email column (unique) of the `users` table, which on query if a row didn't exist was throwing a Column doesn't exist error, but logging and running the query on ZCQL console gave no errors, it is likely a bug, as when I created a new column with indexing turned off, it worked.
- `Catalyst Authorization Fail?` - I configured Catalyst's Hosted Authorization, and it worked also, however I couldn't figure out how to create a new user on signup/ get the auth token on login as there was no mention of a token being passed back as response. The auth page after successful login would redirect to the homepage, which was also accessible without any login. SO I decided to use JWT auth instead. 
- Even doing it via code, I couldn't find the ZAID needed for `userManagement.registerUser()` for Catalyst auth register user method.
- `Biggest issue yet` the user on signup is being sent a `status:200` response (verified by console logging) but on the frontend, I am receiving a `network_err` related to a CORS issue, I tried and allowed all origins requests but still can't figure out what's wrong

### Ending Notes
> I thought of designing a `Collaborative Task Management app` but I faced a lot of trouble setting up Catalyst, Backend Catalyst services, Documentation coverage (slightly outdated), and so I couldn't finish the app entirely on time. Here's what I thought of: 

![image](https://github.com/user-attachments/assets/2bf7170a-cc65-4e04-8bc4-5872fc816a86)

> I feel the Zoho Catalyst Setup, getting used to the documentation and fixing first timer issues took me a long time and this is mainly why I couldn't finish the Frontend, I spent a lot of time trying to have a TypeScript Backend but faced issues with CommonJS, ES modules and ZOHO ... would have saved a lot of time if I got to talk with someone experienced in this suite. The app itself wasn't challenging but the setup was.
> `I'd say I tried my best :) :(`
