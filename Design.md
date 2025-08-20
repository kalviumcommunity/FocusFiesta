# Low-Level Design — Productivity App


```text
+--------------------------------------------------+
|                    Frontend                      |
|         React (Vite) + Context API               |
|                                                  |
| Pages:                                           |
|  - Landing                                       |
|  - Login / Signup                                |
|  - Dashboard                                     |
|  - Tasks + Pomodoro                              |
|  - Chat (WebSocket)                              |
|  - Stats / Reports                               |
+--------------------------------------------------+
                       |
                       |   REST + WS
                       v
+--------------------------------------------------+
|                    Backend                       |
|               Node.js + Express                  |
|                                                  |
| Modules:                                         |
|  - Auth (JWT + Cookies)                          |
|  - Task Manager (CRUD)                           |
|  - Pomodoro Logs                                 |
|  - Chat Service (Socket.IO)                      |
|  - Stats Export (CSV / JSON)                     |
|  - Google Calendar Sync                          |
+--------------------------------------------------+
                       |
                       v
+--------------------------------------------------+
|                    Database                      |
|             MongoDB (Mongoose)                   |
|                                                  |
| Schemas:                                         |
|  - User (email, passwordHash, tokens)            |
|  - Task (title, desc, dueDate, status, eventId)  |
|  - PomodoroLog (taskId, duration, status)        |
|  - Message (senderId, receiverId, content, ts)   |
+--------------------------------------------------+


```

### System Architechture design

``` text 
flowchart LR
    subgraph Client [Frontend - React]
      A[TaskList] -->|CRUD| B[TaskContext]
      C[PomodoroTimer] -->|Logs| D[PomodoroContext]
      E[ChatBox] -->|Messages| F[ChatContext]
      G[Auth UI] -->|Login/Signup| H[AuthContext]
    end

    subgraph Server [Backend - Express.js]
      I[AuthController]
      J[TaskController]
      K[PomodoroController]
      L[ChatController]
    end

    subgraph DB [MongoDB]
      M[(Users)]
      N[(Tasks)]
      O[(PomodoroLogs)]
      P[(Messages)]
    end

    H-->|JWT|I
    B-->|API|J
    D-->|API|K
    F-->|Socket.IO|L

    I-->|CRUD|M
    J-->|CRUD|N
    K-->|CRUD|O
    L-->|CRUD|P
```
## Database Schema (MongoDB Example)

users collection
 ```json
 {
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: Date
}
```

### Auth and User Management

```text  
+-------------------------------+
|   Auth Module                 |
|   (JWT + Cookies)             |
+-------------------------------+
         |
         | POST /signup
         | POST /login
         | GET /me
         v
+-------------------------------+
| Auth Controller               |
| - validate input              |
| - call Auth Service           |
+-------------------------------+
         |
         v
+-------------------------------+
| Auth Service                  |
| - hash/compare password       |
| - sign/verify JWT             |
| - manage cookies              |
+-------------------------------+
         |
         v
+-------------------------------+
| User Schema (MongoDB)         |
| - email                       |
| - passwordHash                |
| - tokens[]                    |
+-------------------------------+
```

### How Task management will work
 ```text 

 +-------------------------------+
|   Task Module (CRUD)          |
+-------------------------------+
         |
         | GET /tasks
         | POST /tasks
         | PUT /tasks/:id
         | DELETE /tasks/:id
         v
+-------------------------------+
| Task Controller               |
| - parse request               |
| - call Task Service           |
+-------------------------------+
         |
         v
+-------------------------------+
| Task Service                  |
| - validate data               |
| - assign userId               |
| - handle sync with Calendar   |
+-------------------------------+
         |
         v
+-------------------------------+
| Task Schema (MongoDB)         |
| - title                       |
| - description                 |
| - dueDate                     |
| - status (pending, done)      |
| - eventId (for calendar sync) |
+-------------------------------+
```
# Low-Level Design — Productivity App


```text
+--------------------------------------------------+
|                    Frontend                      |
|         React (Vite) + Context API               |
|                                                  |
| Pages:                                           |
|  - Landing                                       |
|  - Login / Signup                                |
|  - Dashboard                                     |
|  - Tasks + Pomodoro                              |
|  - Chat (WebSocket)                              |
|  - Stats / Reports                               |
+--------------------------------------------------+
                       |
                       |   REST + WS
                       v
+--------------------------------------------------+
|                    Backend                       |
|               Node.js + Express                  |
|                                                  |
| Modules:                                         |
|  - Auth (JWT + Cookies)                          |
|  - Task Manager (CRUD)                           |
|  - Pomodoro Logs                                 |
|  - Chat Service (Socket.IO)                      |
|  - Stats Export (CSV / JSON)                     |
|  - Google Calendar Sync                          |
+--------------------------------------------------+
                       |
                       v
+--------------------------------------------------+
|                    Database                      |
|             MongoDB (Mongoose)                   |
|                                                  |
| Schemas:                                         |
|  - User (email, passwordHash, tokens)            |
|  - Task (title, desc, dueDate, status, eventId)  |
|  - PomodoroLog (taskId, duration, status)        |
|  - Message (senderId, receiverId, content, ts)   |
+--------------------------------------------------+


```

### System Architechture design

``` text 
flowchart LR
    subgraph Client [Frontend - React]
      A[TaskList] -->|CRUD| B[TaskContext]
      C[PomodoroTimer] -->|Logs| D[PomodoroContext]
      E[ChatBox] -->|Messages| F[ChatContext]
      G[Auth UI] -->|Login/Signup| H[AuthContext]
    end

    subgraph Server [Backend - Express.js]
      I[AuthController]
      J[TaskController]
      K[PomodoroController]
      L[ChatController]
    end

    subgraph DB [MongoDB]
      M[(Users)]
      N[(Tasks)]
      O[(PomodoroLogs)]
      P[(Messages)]
    end

    H-->|JWT|I
    B-->|API|J
    D-->|API|K
    F-->|Socket.IO|L

    I-->|CRUD|M
    J-->|CRUD|N
    K-->|CRUD|O
    L-->|CRUD|P
```
## Database Schema (MongoDB Example)

users collection
 ```json
 {
  _id: ObjectId,
  name: String,
  email: String,
  passwordHash: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: Date
}
```

### Auth and User Management

```text  
+-------------------------------+
|   Auth Module                 |
|   (JWT + Cookies)             |
+-------------------------------+
         |
         | POST /signup
         | POST /login
         | GET /me
         v
+-------------------------------+
| Auth Controller               |
| - validate input              |
| - call Auth Service           |
+-------------------------------+
         |
         v
+-------------------------------+
| Auth Service                  |
| - hash/compare password       |
| - sign/verify JWT             |
| - manage cookies              |
+-------------------------------+
         |
         v
+-------------------------------+
| User Schema (MongoDB)         |
| - email                       |
| - passwordHash                |
| - tokens[]                    |
+-------------------------------+
```

### How Task management will work
 ```text 

 +-------------------------------+
|   Task Module (CRUD)          |
+-------------------------------+
         |
         | GET /tasks
         | POST /tasks
         | PUT /tasks/:id
         | DELETE /tasks/:id
         v
+-------------------------------+
| Task Controller               |
| - parse request               |
| - call Task Service           |
+-------------------------------+
         |
         v
+-------------------------------+
| Task Service                  |
| - validate data               |
| - assign userId               |
| - handle sync with Calendar   |
+-------------------------------+
         |
         v
+-------------------------------+
| Task Schema (MongoDB)         |
| - title                       |
| - description                 |
| - dueDate                     |
| - status (pending, done)      |
| - eventId (for calendar sync) |
+-------------------------------+
```
