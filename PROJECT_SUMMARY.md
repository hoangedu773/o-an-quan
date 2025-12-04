# 📊 Ô Ăn Quan - Project Summary

**Author**: hoangedu773 | **GitHub**: https://github.com/hoangedu773

---

## 🌐 Deployment URLs

| Dịch vụ | Mục đích | URL |
|---------|----------|-----|
| **Vercel** | Frontend | https://o-an-quan.vercel.app |
| **Render** | Backend API | https://o-an-quan.onrender.com |
| **MongoDB Atlas** | Database | cluster0.ts27wa2.mongodb.net |

---

## 🛠️ Tech Stack

| Layer | Công nghệ | Mô tả |
|-------|-----------|-------|
| **Frontend** | React 18 | UI Library |
| **Build Tool** | Vite 5 | Fast dev server & bundler |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **Backend** | Express.js 4 | Node.js web framework |
| **Real-time** | Socket.io 4 | WebSocket for multiplayer |
| **Database** | MongoDB 6 | NoSQL database |
| **Language** | JavaScript ES6+ | Full-stack |

---

## 📦 Dependencies

### Frontend
| Package | Mục đích |
|---------|----------|
| `react` | UI Framework |
| `react-dom` | React DOM rendering |
| `vite` | Build tool |
| `tailwindcss` | CSS framework |
| `postcss` | CSS processing |
| `autoprefixer` | CSS vendor prefixes |
| `socket.io-client` | WebSocket client |

### Backend
| Package | Mục đích |
|---------|----------|
| `express` | HTTP server |
| `socket.io` | WebSocket server |
| `cors` | Cross-origin requests |
| `mongodb` | Database driver |

---

## 🎮 Tính Năng Game

| Tính năng | Mô tả | Status |
|-----------|-------|--------|
| 🌐 **Online Multiplayer** | Tìm đối thủ real-time qua internet | ✅ |
| 👥 **Local PvP** | 2 người chơi cùng 1 máy | ✅ |
| 🤖 **AI Minimax** | Đấu với máy (thuật toán Minimax) | ✅ |
| 🎬 **AI Demo** | Xem 2 AI tự đấu nhau | ✅ |
| 🏆 **Leaderboard** | Bảng xếp hạng người chơi | ✅ |
| 📜 **Match History** | Lịch sử các trận đấu | ✅ |
| 🔐 **Authentication** | Đăng nhập / Đăng ký | ✅ |
| 👤 **Guest Mode** | Chơi không cần đăng nhập | ✅ |

---

## 📁 Cấu Trúc Dự Án

```
O_an_quan/
├── src/
│   ├── components/
│   │   ├── game/          # Game components (Board, Box, etc.)
│   │   ├── layout/        # Layout components (Header, Container)
│   │   ├── screens/       # Screen components (Menu, Game, Login)
│   │   └── ui/            # UI components (Button, Modal)
│   ├── services/          # API & Socket services
│   ├── utils/             # Game logic, AI, helpers
│   ├── config/            # MongoDB config
│   └── styles/            # Global CSS
├── server.js              # Backend Express + Socket.io
├── package.json           # Dependencies
└── vite.config.js         # Vite config
```

---

## 🔐 Bảo Mật

| Item | Status |
|------|--------|
| MongoDB URI in `.env` | ✅ Secured |
| `.gitignore` protects `.env` | ✅ Active |
| No hardcoded passwords | ✅ Clean |
| Environment variables on Vercel | ✅ Set |

---

## 📋 Test Accounts

| Email | Password | Ranking |
|-------|----------|---------|
| `hoang@example.com` | `123456` | 🥇 #1 |
| `hoa@example.com` | `123456` | 🥈 #2 |
| `phi@example.com` | `123456` | 🥉 #3 |

---

## 🚀 Cách Chạy Local

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI

# 3. Run backend
node server.js

# 4. Run frontend (new terminal)
npm run dev
```

---

**Made with ❤️ by hoangedu773**
