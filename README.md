# 🎯 FocusFiesta

FocusFiesta is a **Productivity Tracker Web App** based on the **Pomodoro Technique**.  
It helps users manage tasks, track focus sessions, and collaborate with their team through a built-in chat system.  
Built with the **MERN stack (MongoDB, Express.js, React, Node.js)**.

---

## 🌟 Features

- 🔐 **Authentication**
  - User registration and login (JWT-based).
  - Secure password handling.

- ✅ **Task Management**
  - Add, edit, and delete tasks.
  - Each task has its own **Pomodoro Timer**.
  - Track number of focus sessions per task.

- ⏳ **Pomodoro Timer**
  - Default 25 minutes focus, 5 minutes break.
  - Start/Stop/Reset controls per task.
  - Session auto-logging after completion.

- 📊 **Productivity Stats**
  - Daily and weekly focus stats.
  - Track per-task productivity.
  - Export session history as **CSV/JSON**.

- 💬 **Team Chat**
  - Real-time chat for teams.
  - WebSocket-based live messaging.

- 🎨 **UI & Theme**
  - Clean, minimal **light theme**.
  - Accent color: `#7BBAD2`.
  - Responsive design with **Tailwind CSS**.

---

## 🖥️ Tech Stack

- **Frontend**: React.js + Tailwind CSS  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB  
- **Authentication**: JWT (JSON Web Token)  
- **Real-time**: Socket.IO (for chat)  

---

## 📂 Project Structure

```

FocusFiesta/
│── client/           # Frontend (React + Tailwind)
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── utils/
│       └── App.js
│
│── server/           # Backend (Node + Express)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
│── .env              # Environment variables
│── package.json
│── README.md

````

---

## ⚡ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/FocusFiesta.git
cd FocusFiesta
````

### 2. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Setup environment variables

Create a `.env` file in the `server` folder:

```env
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=5000
```

### 4. Run the app

```bash
# Start backend
cd server
npm start

# Start frontend
cd ../client
npm start
```

App runs on:

* Frontend → `http://localhost:3000`
* Backend → `http://localhost:5000`

---

## 📊 Future Enhancements

* Role-based access (Team Lead vs User).
* Google Calendar integration.
* Push notifications for breaks.
* AI productivity insights.

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss what you’d like to change.

---

## 📜 License

This project is licensed under the **MIT License**.

---

### 🚀 Made with ❤️ by Shivansh Garg and Aditi Singh