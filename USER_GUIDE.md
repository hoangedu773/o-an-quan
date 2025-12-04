# Hướng Dẫn Sử Dụng - Đăng Nhập & Lịch Sử Đấu

**Author**: hoangedu773  
**Date**: 2025-12-04

---

## ✨ Tính Năng Mới

### 1. 🔐 **Đăng Nhập / Đăng Ký**
- Tạo tài khoản mới
- Đăng nhập với email + mật khẩu
- Hoặc chơi khách (không lưu điểm)

### 2. 📜 **Lịch Sử Đấu Toàn Server**
- Xem TẤT CẢ các trận đấu đã diễn ra
- Filter theo mode (PvP, PvA, AvA)
- Hiển thị thời gian real-time
- Thống kê tổng quan

---

## 🎮 Cách Sử Dụng

### Bước 1: Chạy Game

```bash
cd c:\work-space\O_an_quan
npm run dev
```

Truy cập: `http://localhost:3000`

---

### Bước 2: Đăng Nhập (Hoặc Đăng Ký)

#### **Demo Accounts (Có Sẵn):**

| Email | Password | Player Name |
|-------|----------|-------------|
| hoang@example.com | 123456 | Phạm Việt Hoàng |
| hoa@example.com | 123456 | Nguyễn Thái Hòa |
| phi@example.com | 123456 | Nguyễn Ngọc Phi |

**Hoặc đăng ký mới:**
1. Click "Đăng ký ngay"
2. Nhập đầy đủ thông tin
3. Tự động đăng nhập

**Hoặc chơi khách:**
- Click "Chơi Khách" - không lưu điểm

---

### Bước 3: Xem Lịch Sử Đấu

Từ **Menu Chính**, click:
- 📜 **LỊCH SỬ ĐẤU**

**Các tính năng:**
- ✅ Xem tất cả trận đấu
- ✅ Filter: Tất cả / PvP / PvA / AvA
- ✅ Thống kê: Tổng trận, số trận theo mode
- ✅ Thời gian: "Vừa xong", "5 phút trước", "1 giờ trước"...
- ✅ Score chi tiết từng trận

---

### Bước 4: Chơi Game

1. Click **🎮 BẮT ĐẦU TRÒ CHƠI**
2. Chọn mode:
   - **PvP**: Cần đăng nhập (2 real players)
   - **PvA**: Cần đăng nhập (vs AI)
   - **AvA**: Không cần đăng nhập (AI demo)

3. Nếu chưa đăng nhập → Redirect đến Login tự động
4. Chơi game như bình thường

---

## 📊 Data Storage (Hiện Tại)

### localStorage Keys:

```javascript
// 1. Authenticated users
'oanquan_all_users'
// Data: Array of users with username, email, password, playerName

// 2. Current logged in user
'oanquan_auth_user'
// Data: Single user object (without password)

// 3. Global match history
'oanquan_global_matches'
// Data: Array of all matches

// 4. Leaderboard (from before)
'oanquan_leaderboard'
'oanquan_current_player'
```

---

## 🎨 UI Components Mới

### 1. LoginScreen.jsx
```
📍 Path: src/components/screens/LoginScreen.jsx

Features:
- Email + Password form
- Demo accounts list
- Switch to Register
- Guest mode option
- Loading state
```

### 2. RegisterScreen.jsx
```
📍 Path: src/components/screens/RegisterScreen.jsx

Features:
- Full registration form (username, email, password, playerName)
- Form validation
- Password confirm
- Auto-login after register
```

### 3. GlobalMatchHistoryScreen.jsx
```
📍 Path: src/components/screens/GlobalMatchHistoryScreen.jsx

Features:
- Show ALL matches từ toàn server
- Statistics cards (Total, PvP, PvA, AvA)
- Filter buttons
- Match cards with:
  - Game mode badge
  - Player names
  - Scores
  - Result badge (Win/Loss/Draw)
  - Time ago
```

---

## 🔧 Services Mới

### 1. mockAuthService.js
```javascript
📍 Path: src/services/mockAuthService.js

Functions:
- register(username, email, password, playerName)
- login(email, password)
- logout()
- getCurrentUser()
- isLoggedIn()
- getUserById(userId)
```

### 2. mockMatchService.js
```javascript
📍 Path: src/services/mockMatchService.js

Functions:
- getAllMatches() // Get all matches
- getMatchesByUserId(userId) // Get user's matches
- saveMatch(matchData) // Save new match
- getMatchStats() // Get statistics
```

---

## 🔄 User Flow

```
1. Open game
   ↓
2. Chọn "Xem Lịch Sử Đấu" 
   → Không cần login (public)
   ↓
3. Filter theo mode muốn xem
   ↓
4. Hoặc chọn "Bắt Đầu Chơi"
   ↓
5. Nếu chọn PvP/PvA:
   - Chưa login → Redirect to Login
   - Đã login → Start game
   ↓
6. Chơi game & kết quả tự động lưu
   ↓
7. Quay lại menu, xem lịch sử đấu updated
```

---

## 📱 Screenshots Flow

### Menu Screen
```
┌────────────────────────────┐
│      Menu Chính            │
├────────────────────────────┤
│  🎮 BẮT ĐẦU TRÒ CHƠI      │
│  🏆 BẢNG XẾP HẠNG         │
│  📜 LỊCH SỬ ĐẤU           │ ← NEW
│  📖 TRỢ GIÚP              │
└────────────────────────────┘
```

### Login Screen
```
┌────────────────────────────┐
│        🎮                   │
│     Đăng Nhập              │
├────────────────────────────┤
│  💡 Demo accounts:         │
│  hoang@example.com | 123456│
├────────────────────────────┤
│  Email: [_____________]    │
│  Password: [_____________] │
│                            │
│  [🔐 Đăng Nhập]           │
│  [👤 Chơi Khách]          │
│                            │
│  Chưa có tài khoản?        │
│  → Đăng ký ngay           │
└────────────────────────────┘
```

### Match History Screen
```
┌─────────────────────────────────┐
│  📜 Lịch Sử Đấu Toàn Server     │
├─────────────────────────────────┤
│  📊 Statistics:                 │
│  ┌────┬────┬────┬────┐          │
│  │100 │ 40 │ 50 │ 10 │          │
│  │Tổng│PvP │PvA │AvA │          │
│  └────┴────┴────┴────┘          │
├─────────────────────────────────┤
│  Filters:                       │
│  [Tất cả] [PvP] [PvA] [AvA]    │
├─────────────────────────────────┤
│  Match List:                    │
│  ┌───────────────────────────┐  │
│  │ PvA  • 5 phút trước       │  │
│  │ Phạm V.H  45  VS  30  AI  │  │
│  │              [Thắng]      │  │
│  └───────────────────────────┘  │
│  ┌───────────────────────────┐  │
│  │ PvP  • 1 giờ trước        │  │
│  │ Hoàng  40  VS  40  Hòa    │  │
│  │              [Hòa]        │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## ⚙️ Customization

### Thêm Match Mới (Manual)

```javascript
// Trong console (F12):
import { saveMatch } from './services/mockMatchService';

saveMatch({
  playerUserId: 1,
  playerName: 'Test Player',
  gameMode: 'PvA',
  opponentName: 'AI Minimax',
  playerScore: 55,
  opponentScore: 30,
  result: 'win'
});
```

### Xem Data

```javascript
// Xem all users
JSON.parse(localStorage.getItem('oanquan_all_users'));

// Xem current user
JSON.parse(localStorage.getItem('oanquan_auth_user'));

// Xem all matches
JSON.parse(localStorage.getItem('oanquan_global_matches'));
```

---

## 🚀 Next Steps (Future)

- [ ] Connect to real backend API
- [ ] Save match history when game ends
- [ ] Add user profile page
- [ ] Add friends system
- [ ] Add chat (optional)
- [ ] Add achievements
- [ ] Export data to CSV

---

## ✅ Testing Checklist

- [ ] Đăng ký user mới
- [ ] Đăng nhập với demo account
- [ ] Logout
- [ ] Xem lịch sử đấu (không cần login)
- [ ] Filter matches theo mode
- [ ] Chơi game khi đã login
- [ ] Chơi khách
- [ ] Xem thời gian "X phút trước"

---

**Có câu hỏi gì cứ hỏi nhé!** 🚀
