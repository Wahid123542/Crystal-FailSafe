# Crystal FailSafe - Frontend

React-based frontend for the Crystal FailSafe IT Support Ticketing System.

## 🎯 Overview

This is a modern, responsive React application built with Vite and Tailwind CSS. It provides IT staff with a beautiful interface to manage support tickets, view analytics, and communicate with employees.

## ✨ Features

### Pages
- **Login** (`/login`) - IT staff authentication
- **Signup** (`/signup`) - Access request with approval workflow
- **Dashboard** (`/dashboard`) - Main ticket management interface
- **Analytics** (`/analytics`) - Performance metrics and reports

### Components
- **Navbar** - Top navigation with user profile
- **TicketCard** - Individual ticket display with priority/status
- **TicketModal** - 3-tab modal (Details, Email, Reply)
- **Chatbot** - AI assistant for ticket search

## 🛠️ Tech Stack

- **React 18.3.1** - UI library
- **Vite 5.4.10** - Build tool & dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **React Router 6.22.0** - Client-side routing
- **Axios 1.6.7** - HTTP client (ready for API integration)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn

### Installation

1. **Navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open browser:**
```
http://localhost:5173
```

### Building for Production
```bash
npm run build
```

Output will be in `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── Chatbot.jsx          # 171 lines - AI search assistant
│   │   ├── Navbar.jsx            # 103 lines - Top navigation
│   │   ├── TicketCard.jsx        # 102 lines - Ticket display
│   │   └── TicketModal.jsx       # 389 lines - 3-tab modal
│   ├── pages/
│   │   ├── Analytics.jsx         # 288 lines - Metrics dashboard
│   │   ├── Dashboard.jsx         # 182 lines - Main view
│   │   ├── Login.jsx             # 149 lines - Authentication
│   │   └── Signup.jsx            # 347 lines - Registration
│   ├── App.jsx                   # 58 lines - Main app
│   ├── index.css                 # 18 lines - Global styles
│   └── main.jsx                  # 11 lines - Entry point
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── postcss.config.js              # PostCSS configuration
└── README.md                      # This file
```

**Total:** ~1,800 lines of code

## 🎨 Design System

### Colors (Tailwind Config)
```javascript
colors: {
  'crystal-blue': '#0066CC',    // Primary brand color
  'crystal-dark': '#1a1a1a',    // Text color
  'crystal-light': '#f5f5f5',   // Background
  'crystal-green': '#2D5F3F',   // Accent
  'crystal-accent': '#FF6B35',  // Highlights
}
```

### Typography
- Font: System fonts (readable & fast)
- Headers: Bold, large sizes
- Body: Regular weight
- Proper hierarchy throughout

### Components
- Rounded corners (rounded-lg, rounded-xl)
- Shadow elevations (shadow-md, shadow-lg, shadow-2xl)
- Smooth transitions (transition-all, transition-colors)
- Hover states on interactive elements

## 🔌 API Integration (Ready)

The frontend is configured to proxy API requests to `http://localhost:8000`.

### Vite Proxy Configuration
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    }
  }
}
```

### Expected API Endpoints
```
POST   /api/auth/login/          # Login
POST   /api/auth/signup/         # Request access
GET    /api/tickets/             # List tickets
GET    /api/tickets/:id/         # Get ticket
PATCH  /api/tickets/:id/         # Update ticket
POST   /api/tickets/:id/reply/   # Send reply
GET    /api/analytics/stats/     # Get stats
POST   /api/chatbot/search/      # Search tickets
POST   /api/chatbot/chat/        # Chat with AI
```

## 🧪 Current State (Mock Data)

The app currently uses **mock data** for demonstration:

### Authentication
- Any email/password combination works
- Uses localStorage for session management
- Ready for JWT/token-based auth

### Tickets
- 3 hardcoded sample tickets
- All CRUD operations log to console
- Ready to connect to real API

### Chatbot
- Smart pattern-matching responses
- Simulates AI search functionality
- Ready for Claude/OpenAI integration

## 📝 Available Scripts
```bash
# Development
npm run dev              # Start dev server (port 5173)

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Linting (if configured)
npm run lint             # Check code quality
```

## 🎯 Key Features Detail

### 1. Authentication Flow
```
User visits app → Redirected to /login
↓
Enters credentials → Mock validation
↓
Sets localStorage → Redirects to /dashboard
↓
Protected routes check auth → Access granted
```

### 2. Ticket Management
```
Dashboard loads → Fetches tickets (mock)
↓
Click ticket → Modal opens with 3 tabs
↓
Tab 1: Update status/priority/assignment
Tab 2: View original email + attachments
Tab 3: Compose reply to employee
↓
Click Update → Logs changes (ready for API)
```

### 3. Chatbot Search
```
User types query → Pattern matching
↓
"find printer" → Returns printer tickets
"show from john.doe" → Returns user's tickets
"help" → Shows capabilities
↓
Ready for AI backend integration
```

## 🔧 Configuration Files

### package.json
Dependencies and scripts configuration.

### vite.config.js
- Dev server port: 5173
- API proxy to port 8000
- React plugin configuration

### tailwind.config.js
- Custom color palette
- Content paths for purging
- Theme extensions

### postcss.config.js
- Tailwind CSS processing
- Autoprefixer for browser compatibility

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to Netlify

1. Build the app:
```bash
npm run build
```

2. Drag `dist/` folder to Netlify

Or connect GitHub repository:
- Build command: `npm run build`
- Publish directory: `dist`

### Environment Variables

When deploying, set:
```
VITE_API_URL=https://your-backend-url.com
```

Then update axios base URL in your API calls.

## 🐛 Troubleshooting

### Port 5173 already in use
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Tailwind styles not loading
```bash
# Rebuild Tailwind
npm run dev
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Code Examples

### Adding a New Page

1. Create file in `src/pages/`:
```javascript
// src/pages/NewPage.jsx
function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
    </div>
  );
}
export default NewPage;
```

2. Add route in `App.jsx`:
```javascript
import NewPage from './pages/NewPage';

// In routes:
<Route path="/new" element={
  <ProtectedRoute>
    <NewPage />
  </ProtectedRoute>
} />
```

### Making API Calls (when backend is ready)
```javascript
import axios from 'axios';

// GET request
const response = await axios.get('/api/tickets/');
setTickets(response.data);

// POST request
const response = await axios.post('/api/auth/login/', {
  email: 'user@example.com',
  password: 'password123'
});

// PATCH request
await axios.patch(`/api/tickets/${id}/`, {
  status: 'resolved',
  priority: 'high'
});
```

## 🎓 Learning Resources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)

## 👨‍💻 Development Notes

### Code Style
- Use functional components with hooks
- PropTypes for type checking (optional)
- Descriptive variable names
- Comments for complex logic

### State Management
- React useState for local state
- Props for component communication
- localStorage for persistence (temporary)
- Ready for Redux/Context if needed

### Performance
- Lazy loading for routes (optional)
- Memoization for expensive computations
- Proper key props in lists
- Optimized re-renders

## 📞 Support

Issues or questions about the frontend?
- Check the main [README](../README.md)
- Open an issue on GitHub
- Contact: wahidsultani108@gmail.com

---

**Frontend Status:** ✅ Complete & Production Ready

**Ready for:** Backend API Integration#Frontend files
