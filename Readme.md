### Task for Generalist Developer, Frontend + Backend , Task No. 2: React DND + tRPC

Details

Name: Sabin Baniya <br/>
Email: baniya.sabinn@gmail.com <br/>
Phone Number: +977-9806542271 <br/>
Role applied: Generalist Developer <br/>
Your Address: Pokhara, Nepal <br/>
Time log
| Date | Time Spent | Description |
| ----- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 12/01 | 7 Hours | Setup backend with github oauth authentication with passport js and users and also setup frontend structure with drag and drop todo with app |
| 12/02 | 12 Hours | Setup for drag and drop is finally complete with dnd-kit, integrate trpc in the backend, create tasks crud on the backend, create SSE procedures for live data streaming on the frontend, add "add tasks" on the frontend, auth state login and loading screens, most of my time today went due to bugs and bug fixing |
| 12/03 | 8 Hours | Implement logout and some ui changes, implement sorting and filtering each columns in the frontend, implement feature to remember card positions according to user placement and persist that on database |

Your Github Profile: https://github.com/sabinbaniya <br/>
Your LinkedIn Profile: https://www.linkedin.com/in/sabinbaniya <br />

---

QnA

1. Why did I choose these technologies?

- I picked the React DND + tRPC drag and drop task manager with real-time updates using tRPC project. React DND is something I haven't worked with yet, and while I have heard quite about tRPC I was yet to build a project with it so I thought these new things that I haven't used yet provide sufficient challenge for me to complete the task at hand as well as work with something new this time. I'm probably guessing for real-time updates I will be using websockets as they provide long running connections between client and server and are usually good for tasks like real-time updates. TLDR, I ended up using Server Sent Events instead of websockets with tRPC.

2. How did you integrate them?

- I started with the cloudquish boilerplate for express + nextjs setup. Since I was going to build the frontend with nextjs and backend in express it provided a good starting point with some preconfigurations. I used @dnd-kit package to add the drag and drop functionality in the nextjs frontend and used trpc server and client packages both on the backend and frontend to use trpc.

3. Challenges faced and how you overcame them.

- Challenge 1: Implementing authentication
- - Initially I tried a new library called better auth with express but it gave me a type error which i couldn't solve quickly so I had to move back to the good old passport library. I implemented github oauth authentication with passportjs instead. Passportjs is a authentication solution that provides easy integration for various authentication strategies.

- Challenge 2: Implementing the Drag and Drop feature
- - As someone using the react dnd library for the first time, I found it quite lacking in the documentation and instead I found other alternatives such as react beautiful dnd which is created by Atlassian, the company that owns Trello, which is a task manager kind of app that we are actually trying to create here. But for some reason the library seems to be stopped being maintained so I researched some more and found a library called @dnd-kit, this had much more concise docs and also the feature that I was specially looking for, same column drag as well as inter columns drag.

- Challenge 3: Stuck on an inconclusive error from trpc
- - Got a weird error when trying to create trpc procedure for the task's crud and fixed it with this issue after around 1 hour of not understanding what was happening, https://github.com/trpc/trpc/discussions/6012 , to be honest I still don't understand why I got that error, I think i'll look into its why later on.

- Challenge 4: Timezones Timezones Timezones
- - Timezones are weird, I was getting wrong timezone conversion when getting the data back from the database and to fix it I had to set the TZ environment variable as the timezone in this case I set it to UTC to solve it

4. Step-by-step instructions for running the project locally and in production

   Requirements:

   - Node version >= 20
   - Git

step 1: Clone the repo to your machine

```bash
git clone https://github.com/sabnxyz/studious-octo-train
```

step 2: Open up the cloned project folder in your terminal now, after you're inside the project folder, you can see that there are two folders, frontend and backend.

Install the required dependencies in both of this folder as follows:

```bash
cd frontend
pnpm i

cd ../backend
pnpm i
```

step 3: While the dependencies are being installed lets get our environment variables:

For the frontend, our `.env.development` file should look like this

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For the backend

```bash
NODE_ENV=development
PORT=8000
POSTGRES_CONNECTION_STRING_DEV=
POSTGRES_CONNECTION_STRING=
SESSION_SECRET=
GITHUB_AUTH_CLIENT_ID=
GITHUB_AUTH_CLIENT_SECRET=
FRONTEND_URL=http://localhost:3000
TZ="UTC"
```

Note: Empty values are supposed to be filled from your end

step 4: After we have the env variables all configured and the dependencies installed, lets run both the frontend and backend project, so once again, while youre on the backend folder run

```bash
pnpm dev
```

or

```bash
yarn dev
```

or

```bash
npm run dev
```

open up another terminal and cd into the frontend folder and run above commands to start the frontend project as well

If all the steps till here were successful you can access the backend at: http://localhost:8000 and the terminal should output something similar to

```bash
Database connection established successfully.
API SERVER RUNNING ON PORT: 8000 and worker id at ...
```

And the frontend should be accessible at http://localhost:3000

You can now navigate to http://localhost:3000 and the application should be running and you can try it out there.

---

Also checkout the documentation [here]("./Documentation.md")
