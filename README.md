# Job Tracker

A full-stack job application tracking app to help you manage your job search efficiently. Upload resumes and cover letters, keep track of application status, and stay organized—all in one place.

---

## Features

- Add, view, edit, and delete job applications
- Upload and view **resume** and **cover letter** attachments
- Track status: Applied, Interviewing, Offer, Rejected
- Set date applied
- Leave detailed notes
- View job list and click to expand for full details
- Clean and modern React-based UI

---

## Tech Stack

**Frontend**
- React (Vite)
- CSS (custom styles)

**Backend**
- Node.js
- Express
- MongoDB with Mongoose
- Multer (for file uploads)
- dotenv + CORS

---

## Folder Structure

job-tracker/
│
├── client/ # React frontend
│ ├── App.jsx
│ ├── App.css
│ └── services/
│ └── jobService.js
│
├── server/ # Express backend
│ ├── server.js
│ ├── models/
│ │ └── Job.js
│ └── routes/
│ └── jobs.js
│
├── uploads/ # Uploaded files (auto-created)
├── .env
├── .gitignore
├── package.json
└── README.md


---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/ajaretemi/job-tracker.git
cd job-tracker

### 2. Install dependencies
    
#### Server

```bash
cd server
npm install

#### Client

```bash
cd ../client
npm install

### 3. Create .env file in /server

```ini
MONGO_URI=your_mongodb_connection_string
PORT=5000

### 4. Run the app

#### Server

```bash
cd server
npm run dev

#### Client

```bash
cd ../client
npm run dev

App will be running at: http://localhost:5173

## Author
Temi Ajare
