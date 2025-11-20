# ⚔️ AlgoGladiator - Competitive DSA Gaming Platform

AlgoGladiator is a gamified competitive programming platform designed to make Data Structures and Algorithms (DSA) engaging and replayable. It combines real-time multiplayer mechanics with educational content, allowing users to battle via typing speed, knowledge accuracy, and strategic risk-taking.

## 🌟 Key Features

### 1. Algorithm Roulette (Flagship Mode)
A high-stakes strategic battle combining luck, logic, and DSA knowledge.
*   **12-Slot Chamber Mechanism:** Players manage a revolver cylinder containing Pass, Fail, and Critical slots.
*   **Strategic Items/Abilities:** Use 8 unique items based on algorithm concepts (e.g., *Binary Search* to scan chambers, *Hash Table* for full vision, *QuickSort* to partition slots).
*   **MCQ Integration:** Every shot requires answering a hardcoded DSA question correctly to proceed.
*   **AI Opponent:** Adaptive AI that learns from player behavior and makes calculated risks.

### 2. Typing Duel
A real-time 1v1 typing race focused on technical terminology.
*   **Socket-Synchronized Racing:** Real-time updates of opponent progress.
*   **WPM & Accuracy Tracking:** Live calculation of typing statistics.
*   **Penalty System:** Wrong answers or typos result in health/time penalties.

### 3. Global Leaderboards & Analytics
*   Track win streaks, ELO ratings, and overall accuracy.
*   Detailed game logs for post-match analysis.

## 🛠️ Tech Stack

*   **Frontend:** React.js, Tailwind CSS, Framer Motion (for animations).
*   **Backend:** Node.js, Express.js.
*   **Real-time Communication:** Socket.io.
*   **Database & Auth:** Firebase (Firestore & Authentication).
*   **Deployment:** Vercel (Frontend) & Railway (Backend).

## 🚀 Setup & Installation

### Prerequisites
*   Node.js (v14+)
*   npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/es-solution/CompeteHub-AlgoGladiator.git
cd CompeteHub-AlgoGladiator
2. Install Dependencies
Client:

bash
cd client # (or root if root is client)
npm install
Server:

bash
cd server
npm install
3. Environment Configuration
Create a .env file in the client root directory. You will need to populate it with your specific Firebase credentials.

For Local Development (.env.local):

text
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Local Socket Server
VITE_SOCKET_URL=http://localhost:3000
For Production (.env.production):

text
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Production Socket Server (Railway)
VITE_SOCKET_URL=https://gladiator-production.up.railway.app/
4. Running the Application
Start the Backend Server:

bash
# In /server directory
node server.js
Start the Client:

bash
# In root/client directory
npm run dev
The application will launch at http://localhost:5173
