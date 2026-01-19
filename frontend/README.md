# Crystal FailSafe - Frontend

React frontend for Crystal FailSafe IT ticketing system.

## 🛠️ Tech Stack

- React 18.3
- Vite 5.4
- Tailwind CSS 3.4
- React Router 6.22
- Axios 1.6

## 🚀 Quick Start
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

## 📁 Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Chatbot.jsx       # AI assistant
│   │   ├── Navbar.jsx         # Navigation
│   │   ├── TicketCard.jsx     # Ticket display
│   │   └── TicketModal.jsx    # 3-tab modal (389 lines)
│   ├── pages/
│   │   ├── Login.jsx          # Authentication
│   │   ├── Signup.jsx         # Registration
│   │   ├── Dashboard.jsx      # Main view
│   │   └── Analytics.jsx      # Metrics
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── tailwind.config.js
```

**Total:** ~1,800 lines of code

## 🎨 Features

- **Pages:** Login, Signup, Dashboard, Analytics
- **Components:** Navbar, TicketCard, TicketModal (3 tabs), Chatbot
- **Routing:** Protected routes with authentication
- **Styling:** Tailwind with Crystal Bridges colors
- **Mock Data:** 3 sample tickets for demo

## 🔌 API Ready

Configured to proxy `/api` requests to `http://localhost:8000` (Django backend).

Expected endpoints:
```
POST   /api/auth/login/
GET    /api/tickets/
PATCH  /api/tickets/:id/
POST   /api/tickets/:id/reply/
GET    /api/analytics/stats/
POST   /api/chatbot/search/
```

## 📝 Scripts
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🚀 Deploy

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
- Build command: `npm run build`
- Publish directory: `dist`

## 👨‍💻 Author

**Wahid** - University of Arkansas
- Built with React, Vite, Tailwind CSS
- Production-ready frontend

---

**Status:** ✅ Complete & Ready for Backend Integration
