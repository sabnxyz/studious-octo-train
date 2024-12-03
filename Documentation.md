## Project Documentation:

### Project Overview:

This is a trello like Task management application created using Next.JS as the frontend and Express.JS as the backend. The project features interactive kanban board for easier task management along with options to setup task priority and due date as well. I chose to build this project because it provide a good mix of learning along with building something useful.

### Tech Stack:

- Frontend: Next.JS, TailwindCSS, tRPC client, React Query, @dnd-kit
- Backend: Express.JS, Typeorm, PostgreSQL, tRPC server, PassportJS, Github oauth

### Key Learnings

- tRPC

  - Type Safety: I got to experience the benefits of type-safe API calls, reducing runtime errors and improving the overall developer experience.
    -Integration: Understood the process of integrating tRPC with both Next.JS (client) and Express.JS (server) for seamless communication.

- @dnd-kit
  - Drag and Drop: I learned how to implement smooth and responsive drag-and-drop functionality in this project.
  - Integration: Understood the integration process of @dnd-kit with NextJS.
  - Complexity: Understood how complex implementing Drag and Drop can be and all the complexities that we never have to explore thanks to libraries like these that save a lot of time for us to build these kinds of stuffs.

### Design process

- Used vercel's geist mono font to implement a simple clean look for the task manager project,
- Added simple login with github instead of the hassle of using email & password to login and signup,
- Add sorting feature in the task's view columns
- Add filtering feature to filter by task priority, due date, created date etc.
