# Antibiotic Safe Disposal Platform

A full-stack MERN application representing a digital ecosystem that encourages the safe disposal of antibiotics and medicines to combat antimicrobial resistance (AMR).

## 🚀 Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT & bcrypt
- **Integrations**: Google Maps JS API, Claude API (Anthropic), Nodemailer, Chart.js

## 📁 Project Structure

- `/client` - React frontend (to be implemented)
- `/backend` - Node.js Express backend API

## 🛠️ Setup Instructions

### Backend (/backend)
1. Navigate to the `backend` directory:  
   `cd backend`
2. Install dependencies:  
   `npm install`
3. Configure your environment variables. Ensure you have a `.env` file (which is git-ignored) with the following fields:
   ```env
   MONGO_URI=<mongodb_connection_string>
   JWT_SECRET=<jwt_secret_token>
   EMAIL_USER=<your_email>
   EMAIL_PASS=<your_email_password>
   GOOGLE_MAPS_API_KEY=<your_google_maps_key>
   CLAUDE_API_KEY=<your_claude_api_key>
   PORT=5000
   ```
4. Start the server:  
   `npm start` _(Note: or run `node server.js`)_

## 🛡️ License
MIT License
