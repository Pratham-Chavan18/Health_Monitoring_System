# 🏥 Health Monitoring System

A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) application for real-time patient health monitoring. Features a modern dark-themed UI with glassmorphism design, animated dashboards, interactive charts, and secure authentication.

---

## ✨ Features

### Frontend
- **Modern Dark UI** — Glassmorphism design with animated floating blobs
- **Animated Dashboard** — Stat counters, doughnut chart (patient status), line chart (heart rates)
- **Patient Card Grid** — Search, filter, skeleton loading, staggered card animations
- **Edit Modal** — Spring-animated modal with blurred overlay
- **Prescription Editor** — Split-panel layout with patient selector
- **Secure Auth** — Password strength meter (5 rules), confirm password, rate limiting (5 attempts → 30s lockout), email validation
- **Page Transitions** — Framer Motion `AnimatePresence` slide transitions
- **Toast Notifications** — Dark-themed react-toastify for all actions
- **Responsive** — Sidebar collapses to icons on mobile

### Backend
- **MVC Architecture** — `config/`, `controllers/`, `routes/`, `middleware/`
- **JWT Authentication** — Secure token-based login
- **Environment Variables** — No hardcoded secrets
- **Health Check** — `GET /api/health` endpoint
- **Error Handling** — Global error middleware with stack traces in dev

---

## 📁 Project Structure

```
Health_Monitoring_System/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Signup/login logic
│   │   └── patientController.js   # Patient CRUD + prescriptions
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── errorHandler.js        # Global error handler
│   ├── routes/
│   │   ├── auth.js                # /api/auth routes
│   │   └── patients.js            # /api/patients routes
│   ├── tests/
│   │   └── health.test.js         # Health endpoint test
│   ├── server.js                  # Express app entry point
│   ├── Dockerfile                 # Production Docker image
│   ├── render.yaml                # Render Blueprint
│   ├── package.json
│   └── .env.example               # Env var template
│
├── frontend/
│   ├── public/
│   │   └── index.html             # HTML with SEO meta tags
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js     # React Context for auth state
│   │   ├── hooks/
│   │   │   └── usePatients.js     # Custom hook: patient CRUD
│   │   ├── components/
│   │   │   ├── Auth.js / Auth.css           # Login/signup page
│   │   │   ├── Sidebar.js / Sidebar.css     # Navigation sidebar
│   │   │   ├── Dashboard.js / Dashboard.css # Stats + charts
│   │   │   ├── PatientTable.js / PatientTable.css # Patient cards
│   │   │   ├── EditModal.js / EditModal.css       # Edit patient
│   │   │   └── PrescriptionPanel.js / PrescriptionPanel.css
│   │   ├── App.js                 # Main app with page transitions
│   │   ├── App.css                # Global dark theme styles
│   │   └── index.js               # Entry point with AuthProvider
│   ├── Dockerfile                 # Nginx production image
│   ├── nginx.conf                 # SPA routing config
│   ├── vercel.json                # Vercel deployment config
│   ├── package.json
│   └── .env.example               # Env var template
│
├── docker-compose.yml             # Full-stack local dev
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Layer      | Technology                                                     |
|------------|----------------------------------------------------------------|
| **Frontend** | React 18, Framer Motion, Chart.js, React Toastify, React Icons |
| **Backend**  | Node.js, Express.js, MongoDB (Atlas), JWT, bcryptjs            |
| **DevOps**   | Docker, Docker Compose, Render, Vercel                         |
| **Testing**  | Jest, Supertest                                                |

---

## 🚀 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Health_Monitoring_System.git
cd Health_Monitoring_System
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env` from the template:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=<generate-a-strong-random-string>
CLIENT_URL=http://localhost:3000
```

> **Tip:** Generate a JWT secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Start the backend:

```bash
node server.js
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📋 Health check: http://localhost:5000/api/health
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

Start the frontend:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Docker (Alternative)

```bash
# From root directory
docker-compose up --build
```

This starts both backend (port 5000) and frontend (port 3000).

---

## 📡 API Endpoints

| Method | Endpoint                         | Description            | Auth |
|--------|----------------------------------|------------------------|------|
| GET    | `/api/health`                    | Health check           | ❌   |
| POST   | `/api/auth/signup` or `/signup`  | Register new user      | ❌   |
| POST   | `/api/auth/login` or `/login`    | Login & get JWT token  | ❌   |
| GET    | `/api/patients` or `/patients`   | Get all patients       | ❌   |
| POST   | `/api/patients` or `/patients`   | Add a patient          | ❌   |
| PUT    | `/api/patients/:id`              | Update a patient       | ❌   |
| DELETE | `/api/patients/:id`              | Delete a patient       | ❌   |
| POST   | `/api/patients/:id/prescriptions`| Add prescription       | ✅   |
| PUT    | `/api/patients/:id/prescriptions/:pid` | Update prescription | ✅ |
| DELETE | `/api/patients/:id/prescriptions/:pid` | Delete prescription | ✅ |

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npx jest --forceExit --detectOpenHandles
```

Expected output:
```
✓ GET /api/health should return status ok
Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

---

## ☁️ Deployment

### Backend → Render

#### Option A: Render Blueprint (Automatic)

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
3. Connect your GitHub repo
4. Render reads `backend/render.yaml` and creates the service
5. Set these environment variables in Render dashboard:

| Variable     | Value                                      |
|--------------|--------------------------------------------|
| `MONGO_URI`  | Your MongoDB Atlas connection string       |
| `CLIENT_URL` | Your Vercel frontend URL (after deploying) |

> `JWT_SECRET` is auto-generated by the Blueprint.

6. Click **Apply** — Render will build and deploy automatically

#### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
4. Add environment variables: `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
5. Deploy

#### Verify Backend

```
https://your-app.onrender.com/api/health
→ { "status": "ok", "timestamp": "..." }
```

---

### Frontend → Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New** → **Project**
2. Import your GitHub repo
3. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `build` (auto-detected)
4. Add environment variable:

| Variable              | Value                                    |
|-----------------------|------------------------------------------|
| `REACT_APP_API_URL`   | `https://your-backend.onrender.com`      |

5. Click **Deploy**

#### After Both Are Deployed

Go back to Render and update `CLIENT_URL` to your Vercel frontend URL:

```
CLIENT_URL=https://your-frontend.vercel.app
```

---

## 🔐 Security Features

| Feature                    | Description                                         |
|----------------------------|-----------------------------------------------------|
| **JWT Authentication**     | Token-based auth with configurable secret           |
| **Password Hashing**       | bcryptjs with salting                               |
| **Password Strength**      | 5-rule client-side validation (length, upper, lower, number, special) |
| **Rate Limiting**          | 5 failed login attempts → 30s lockout               |
| **Confirm Password**       | Required match on signup                            |
| **Email Validation**       | Real-time format checking                           |
| **Environment Variables**  | All secrets in `.env`, never committed               |
| **CORS**                   | Configured for allowed origins only                 |
| **Input Validation**       | Server-side validation on all endpoints             |

---

## 🎨 React Features Used

| Feature               | Implementation                                           |
|-----------------------|----------------------------------------------------------|
| **React Context**     | `AuthContext` for global auth state management           |
| **Custom Hooks**      | `useAuth`, `usePatients` for logic encapsulation         |
| **Framer Motion**     | Page transitions, staggered lists, spring modals         |
| **Chart.js**          | Doughnut (status) + Line (heart rate) charts             |
| **React Toastify**    | Dark-themed toast notifications                          |
| **React Icons**       | Feather icon set across all components                   |
| **AnimatePresence**   | Smooth page switching with exit animations               |
| **useMemo/useCallback** | Performance optimization in hooks and components      |

---

## 📋 Environment Variables Reference

### Backend (`backend/.env`)

| Variable     | Required | Description                            | Example                                        |
|-------------|----------|----------------------------------------|------------------------------------------------|
| `PORT`      | No       | Server port (default: 5000)            | `5000`                                         |
| `MONGO_URI` | Yes      | MongoDB Atlas connection string        | `mongodb+srv://user:pass@cluster.mongodb.net/`  |
| `JWT_SECRET`| Yes      | Secret for JWT signing                 | `a1b2c3d4...` (use crypto.randomBytes)         |
| `CLIENT_URL`| No       | Frontend URL for CORS                  | `http://localhost:3000`                        |

### Frontend (`frontend/.env`)

| Variable              | Required | Description                    | Example                              |
|-----------------------|----------|--------------------------------|--------------------------------------|
| `REACT_APP_API_URL`   | Yes      | Backend API base URL           | `http://localhost:5000`              |

---

## 🔮 Future Improvements

- [ ] Real-time updates with WebSockets
- [ ] Role-based access control (Admin, Doctor, Nurse)
- [ ] Patient data export (CSV/PDF)
- [ ] Two-factor authentication (2FA)
- [ ] Automated CI/CD pipeline (GitHub Actions)
- [ ] Backend rate limiting with express-rate-limit
- [ ] Frontend unit tests with React Testing Library

---

## 📄 License

MIT License — feel free to use this project for learning and portfolio purposes.
