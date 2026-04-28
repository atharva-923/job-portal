# 🧑‍💼 Job Portal — Full Stack Web Application

A full-stack job portal web application where job seekers can browse and apply for jobs, companies can post and manage listings, and an admin has full oversight of the platform.

**🔗 Live Demo:** [job-portal-beta-lake.vercel.app/register.html](https://job-portal-beta-lake.vercel.app/register.html)

---

## ✨ Features

- 🔐 JWT-based authentication with bcrypt password hashing
- 👤 Three user roles — Job Seeker, Company, Admin
- 📋 Browse, search, and filter job listings by category
- 📝 Apply for jobs and track application status in real time
- 🏢 Companies can post jobs and manage received applications
- 👤 Profile page with skill badges and resume upload
- ⚡ Auto-deploy on every GitHub push via Vercel + Render

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcryptjs |
| Frontend Host | Vercel |
| Backend Host | Render |

---

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── applications.js
│   │   └── users.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── jobs.html
├── job-details.html
├── login.html
├── register.html
├── profile.html
├── about.html
├── contact.html
├── script.js
└── style.css
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Git installed

### 1. Clone the repo
```bash
git clone https://github.com/atharva-923/job-portal.git
cd job-portal
```

### 2. Setup the backend
```bash
cd backend
npm install
```

### 3. Create a `.env` file inside the `backend` folder
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 4. Seed the database (optional — loads 20 sample jobs)
```bash
node seed.js
```

### 5. Start the backend server
```bash
node server.js
```

### 6. Open the frontend
Open `jobs.html` directly in your browser or use Live Server in VS Code.

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://job-portal-beta-lake.vercel.app |
| Backend | Render | https://job-portal-backend-g5ju.onrender.com |
| Database | MongoDB Atlas | Cloud hosted |

> ⚠️ Render free tier spins down after 15 mins of inactivity. First request may take ~50 seconds to wake up.

---

## 📡 API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/jobs | Public |
| POST | /api/jobs | Company / Admin |
| DELETE | /api/jobs/:id | Company / Admin |
| POST | /api/applications | Logged In |
| GET | /api/applications/mine | Logged In |
| PATCH | /api/applications/:id | Company / Admin |
| GET | /api/users/profile | Logged In |
| PATCH | /api/users/profile | Logged In |

---

## 👨‍💻 Author

**Atharva Patil**
- GitHub: [@atharva-923](https://github.com/atharva-923)

---

## 📄 License

This project is for academic purposes.
