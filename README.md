# Collaborative Workspace

 Collaborative Workspace is a **real-time task management and communication platform** built with the **MERN stack**.
It enables teams to **plan, track, and collaborate** efficiently through automated scheduling, progress tracking, and integrated reporting.

##  Features

###  Task Management

* Auto-populates the calendar with project tasks, deadlines, and coach-assigned tasks.
* Supports **CRUD operations** for tasks (create, update, delete).
* Dynamic task status tracking (To-Do, In Progress, Completed).

###  Progress Updates

* Update progress using **text inputs, checklists, voice notes**, or **file attachments**.
* Automatic sync with team dashboard and progress visualization.

###  Team Collaboration

* Seamless integration with **GitHub**, **Google Docs**, and **Notion** for joint project work.
* Shared workspaces with real-time updates using **Socket.io** (optional).

###  Meeting Scheduling

* Automatically schedules **standups, reviews, and milestones** using project deadlines.
* Integrates with **Google Calendar API** for meeting sync and reminders.

###  Weekly Timesheets

* Auto-generates weekly reports including:

  * Task completion rate
  * Peer feedback summaries
  * Mentor reviews
* Reports accessible to all team members and mentors.

###  Feedback System

* Collects mentor and peer feedback on submitted work.
* Displays feedback alongside corresponding tasks for actionable insights.


##  Architecture Overview

```
Collaborative-Workspace/
│
├── client/                           # Frontend (React + TailwindCSS + Redux Toolkit)
│   ├── public/                       # Static assets (favicon, images)
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js              # Redux Toolkit store configuration
│   │   ├── assets/                   # Images, fonts, and global styles
│   │   ├── components/               # Reusable UI Components
│   │   │   ├── Navbar.jsx            # Top navigation
│   │   │   ├── Sidebar.jsx           # Workspace navigation
│   │   │   ├── Modal.jsx             # Generic modal component
│   │   │   └── Button.jsx            # Tailwind-styled buttons
│   │   ├── features/                 # Redux Slices (State Management)
│   │   │   ├── auth/                 # Authentication slice (login/register)
│   │   │   ├── workspace/            # Workspace data slice
│   │   │   └── integrations/         # State for GitHub/Notion integrations
│   │   ├── pages/                    # Main Application Pages
│   │   │   ├── Dashboard.jsx         # User dashboard
│   │   │   ├── Login.jsx             # Login page
│   │   │   └── Workspace.jsx         # Specific workspace view
│   │   ├── services/                 # API calls (Axios/RTK Query)
│   │   ├── App.jsx                   # Main component & Routing
│   │   └── index.css                 # Tailwind directives (@tailwind base; etc.)
│   ├── .env                          # Frontend environment variables
│   ├── package.json                  # Frontend dependencies
│   └── tailwind.config.js            # TailwindCSS configuration
│
├── server/                           # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js                     # MongoDB connection setup
│   ├── controllers/                  # Logic for handling requests
│   │   ├── authController.js         # Login, Register, Refresh Token
│   │   ├── workspaceController.js    # CRUD operations for workspaces
│   │   └── integrationController.js  # Logic for GitHub/Notion/Google Docs APIs
│   ├── models/                       # Mongoose Schemas
│   │   ├── User.js                   # User schema
│   │   └── Workspace.js              # Workspace data schema
│   ├── routes/                       # API Routes
│   │   ├── authRoutes.js             # /api/auth
│   │   ├── workspaceRoutes.js        # /api/workspaces
│   │   └── integrationRoutes.js      # /api/integrations
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification middleware
│   │   └── errorMiddleware.js        # Global error handling
│   ├── utils/                        # Helper functions
│   │   └── generateToken.js          # JWT generation utility
│   ├── .env                          # Backend secrets (MONGO_URI, JWT_SECRET, API_KEYS)
│   ├── server.js                     # Entry point for the backend server
│   └── package.json                  # Backend dependencies
│
└── README.md                         # Project documentation

```

##  Technology Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Frontend       | React.js, Redux Toolkit, TailwindCSS    |
| Backend        | Node.js, Express.js                     |
| Database       | MongoDB (Mongoose ORM)                  |
| Authentication | JWT, bcrypt                             |
| Integrations   | GitHub API, Google Docs API, Notion API |
| Deployment     | Render / Vercel / MongoDB Atlas         |

---

##  Installation

### 1️ Clone the Repository

```bash
git clone https://github.com/Ramasaikiran/Collaborative-Workspace.git
cd Collaborative-Workspace
```

### 2️ Install Dependencies

```bash
# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

### 3️ Environment Variables

Create a `.env` file in the **server** directory and add:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GITHUB_API_KEY=your_github_key
GOOGLE_API_KEY=your_google_key
```

### 4️ Run the Application

```bash
# Run backend
cd server
npm start

# Run frontend
cd ../client
npm start
```



##  Future Enhancements

* AI-based **task prioritization** and smart suggestions.
* **Slack/Discord integration** for team notifications.
* Voice-to-text transcription for meeting summaries.
* Advanced analytics dashboard for team productivity metrics.



##  Contributing

Contributions are welcome!
Please fork the repo and submit a PR after making necessary updates.
For major changes, open an issue first to discuss what you’d like to change.


##  License

This project is licensed under the **MIT License**.

