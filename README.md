
# 🎨 Hobby Session Management App

**A full-stack web app to organize, join, and manage hobby sessions.**
Built with **React (Vite)** + **Node.js (Express)** and deployed on **Render**.

---

## 🌐 Live Demo

🔗 **Frontend:** [https://reactapp-frontend-wrdv.onrender.com](https://reactapp-frontend-wrdv.onrender.com)
🖥️ **Backend API:** [https://reactapp-34io.onrender.com/api/sessions](https://reactapp-34io.onrender.com/api/sessions)

---

## 🧩 Overview

This app allows users to:

* Create hobby sessions (e.g. chess, painting, music jam 🎶).
* Join or leave public sessions.
* Create private sessions accessible via a secret link.
* Manage, edit, or delete sessions with a **management code**.
* View **upcoming** and **past** sessions separately.
* Manage attendees — remove them if needed.

---




## ⚙️ Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| **Frontend**   | React (Vite), Lucide React Icons, Vanilla CSS |
| **Backend**    | Node.js, Express                              |
| **Deployment** | Render (Frontend + Backend)                   |
| **Storage**    | In-memory (no database yet)                   |

---

## 🏗️ Project Structure

```
ReactApp/
│
├── backend/              # Express backend
│   ├── server.js
│   └── package.json
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── SessionList.jsx
│   │   │   ├── CreateSession.jsx
│   │   │   └── SessionDetail.jsx
│   │   ├── services/api.js
│   │   ├── styles/
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🔐 Environment Variables

### Frontend `.env`

```env
VITE_API_URL=https://reactapp-34io.onrender.com/api
VITE_PORT=5173
```

---

## 💻 Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Achini-gf/ReactApp.git
cd ReactApp
```

### 2️⃣ Start the backend

```bash
cd backend
npm install
npm start
```

Runs on **[http://localhost:5000](http://localhost:5000)**

### 3️⃣ Start the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Opens at **[http://localhost:5173](http://localhost:5173)**

---

## 🧪 Test the App

1. Create a session (choose public or private).
2. Join using your name.
3. Open management link → test **Edit** and **Delete**.
4. Verify attendee removal and session updates.
5. Refresh → confirm upcoming and past sessions separate correctly.

---

##  Deployment on Render

### **Frontend**

* Build Command:

  ```bash
  npm run build
  ```
* Publish Directory:

  ```
  frontend/dist
  ```
* Environment Variable:

  ```
  VITE_API_URL=https://reactapp-34io.onrender.com/api
  ```

### **Backend**

* Start Command:

  ```bash
  node server.js
  ```

---

## 🧠 Future Improvements

*  Add database (MongoDB or PostgreSQL).
*  Add authentication for session creators.
* Email reminders for upcoming sessions.
*  Advanced filtering & keyword search.
*  Responsive mobile-first redesign.

---

## 👩‍💻 Author

**Achini G. Fernando**
📍 Oulu, Finland
💡 Passionate about full-stack web development and user-friendly interfaces.


---

Would you like me to **add clickable screenshots** (preview images from your app) or keep it clean and text-based like this?
