MERN Task Management App

A full-stack Task Management application built using the MERN stack — MongoDB, Express.js, React, and Node.js.

This application allows users to create, manage, search, filter, update, and delete tasks through a simple and responsive interface.

Features

- Create new tasks
- Set task priority
- Update task statusInstallation

1. Clone the repository

git clone https://github.com/tamizazhagan8762/mern-task-management.git
cd mern-task-management

2. Install dependencies

Frontend

npm install

Backend

cd server
npm install

3. Start the application

Start the backend server:

node server.js

Then start the React frontend from the project root:

npm run dev

The application will be available locally through the Vite development server.
- Delete tasks
- Search tasks
- Filter tasks
- Store tasks in MongoDB
- REST API using Express.js
- Responsive React frontend

Tech Stack

- Frontend: React.js, Vite
- Backend: Node.js, Express.js
- Database: MongoDB
- Styling: CSS
- API: REST API
- Version Control: Git & GitHub
Project Structure

mern-task-management/
│
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── index.css
│
├── server/
│   ├── server.js
│   └── Task.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── index.html
└── vite.config.js

API Endpoints

Method| Endpoint| Description
GET| "/api/tasks"| Get all tasks
POST| "/api/tasks"| Create a new task
PUT| "/api/tasks/:id"| Update a task
DELETE| "/api/tasks/:id"| Delete a task
