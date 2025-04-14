# 💎 Gem Study Flashcard App

Gem Study is a modern, intelligent flashcard web application built with React, Firebase, and Google's Gemini AI. It helps students and lifelong learners create, manage, and study flashcard sets — all while tracking progress and enhancing their learning experience with AI-assisted suggestions.

## ✨ Features

- ✅ **Create & Manage Flashcard Sets**  
  Organize topics and subjects into easily accessible flashcard collections.

- 🧠 **AI-Powered Flashcard Generation**  
  Automatically generate flashcards using the Gemini API from simple topic prompts.

- 📊 **Study Statistics & Streak Tracking**  
  Monitor your learning activity, study sessions, and maintain daily streaks.

- 🔒 **Authentication**  
  Secure sign-in and sign-up flow powered by Firebase Authentication.

- 🔔 **Beautiful UI**  
  Built with **Shadcn/UI** and Tailwind CSS to provide a sleek, responsive, and accessible interface.

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Styling/UI**: Shadcn/UI, Tailwind CSS
- **Authentication & Backend**: Firebase (Auth, Firestore, Server Timestamps)
- **AI Integration**: Gemini API (Google's GenAI)
- **State & Data Fetching**: React Tanstack Query
- **Notifications**: Sonner Toast + Custom Alerts

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Firebase Project (for Firestore & Auth)
- Gemini API Key from [Google AI Studio](https://makersuite.google.com/)

### Installation

```bash
git clone https://github.com/ivioje/gem-study-flashcards.git
cd gem-study-flashcards
npm install
```

### Environment Variables

Create a `.env` file in the root of the project and add:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_API_URL=your_gemini_api_url
```

### Run Locally

```bash
 npm run dev
```

### 📈 Future Improvements

- AI quiz generation based on flashcards

- Flashcard sharing and public study sets

- Rich text or image support in cards

- Mobile app version with React Native

### 🙌 Acknowledgements

- Shadcn/UI

- Firebase

- Gemini API

- TanStack Query (React Query)

### 📄 License

This project is open source under the MIT License.
