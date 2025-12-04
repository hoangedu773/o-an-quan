# Leaderboard & Ranking System - Feature Summary

## ✅ Completed Features

Đã hoàn thành hệ thống **Bảng Xếp Hạng** với các tính năng sau:

### 🏆 Top 3 Players (Seeded Data)

Hệ thống có sẵn **3 người chơi xếp hạng cao nhất**:

1. **🥇 Phạm Việt Hoàng** - 320 điểm (150W/30L/20D) - 75% Win Rate
2. **🥈 Nguyễn Thái Hòa** - 255 điểm (120W/40L/15D) - 68.57% Win Rate  
3. **🥉 Nguyễn Ngọc Phi** - 225 điểm (100W/50L/25D) - 57.14% Win Rate

### 📊 Tính Điểm

- **Thắng (Win)**: +2 điểm
- **Hòa (Draw)**: +1 điểm
- **Thua (Loss)**: 0 điểm

### 💾 Lưu Trữ

- Sử dụng **localStorage** để lưu ranking
- Tự động khởi tạo với 3 người chơi top khi lần đầu vào game
- Dữ liệu persistent (không mất khi reload page)

### 🎮 Player Registration

- Modal nhập tên khi bắt đầu game (PvP/PvA modes)
- Validate tên (2-30 ký tự)
- Tùy chọn "Chơi Khách" (không lưu điểm)
- Hiển thị tên người chơi hiện tại ở menu
- Cho phép đổi người chơi

### 📈 Bảng Xếp Hạng

- Hiển thị danh sách toàn bộ người chơi
- Sắp xếp theo điểm số (giảm dần)
- Highlight người chơi hiện tại
- Hiển thị: Hạng, Tên, Số trận, Thắng/Thua/Hòa, Tỉ lệ %, Điểm
- Responsive design (mobile friendly)
- Icon medal cho top 3 (🥇🥈🥉)

### 🔄 Auto-Save Results

- Tự động lưu kết quả sau mỗi trận đấu
- Cập nhật stats: wins, losses, draws, totalGames
- Tính toán lại win rate và điểm số
- Thông báo rõ ràng khi thắng/thua/hòa

## 📁 Files Created/Modified

### New Files

1. **`src/utils/leaderboard.js`** - Quản lý leaderboard logic
   - `initializeLeaderboard()` - Khởi tạo với data mặc định
   - `getLeaderboard()` - Lấy danh sách ranking
   - `getCurrentPlayer()` - Lấy thông tin player hiện tại
   - `setCurrentPlayer(name)` - Set player hiện tại
   - `updatePlayerStats(result)` - Cập nhật stats sau game
   - `getPlayerRank(id)` - Lấy hạng của player
   - `clearCurrentPlayer()` - Xóa player hiện tại
   - `resetLeaderboard()` - Reset về mặc định

2. **`src/components/ui/PlayerNameModal.jsx`** - Modal nhập tên
   - Form validation
   - Skip option
   - Error handling

3. **`src/components/screens/LeaderboardScreen.jsx`** - Màn hình ranking
   - Table display
   - Rank icons
   - Current player highlight
   - Responsive table

### Modified Files

4. **`src/App.jsx`** - Integration
   - Import leaderboard utilities
   - Import PlayerNameModal & LeaderboardScreen
   - Player state management
   - Navigation logic
   - Show player info on menu
   - Change player functionality

5. **`src/components/screens/MainMenu.jsx`** - Menu update
   - Added Leaderboard button (🏆 BẢNG XẾP HẠNG)
   - Pass `onShowLeaderboard` prop

6. **`src/components/screens/GameScreen.jsx`** - Result saving
   - Import `updatePlayerStats`
   - Accept `currentPlayer` prop
   - Save result in `endGame()` function
   - Different messages for logged-in/guest players

## 🎯 How It Works

### Flow Diagram

```
1. User opens game
   ↓
2. System initializes leaderboard (if first time)
   ↓
3. User clicks game mode (PvP/PvA)
   ↓
4. If no player logged in → Show PlayerNameModal
   ↓
5. User enters name or clicks "Chơi Khách"
   ↓
6. Game starts (player info stored in state)
   ↓
7. Game ends with result
   ↓
8. If logged in → updatePlayerStats(result)
   ↓
9. Leaderboard automatically updated
   ↓
10. User can view ranking anytime from menu
```

## 🚀 Usage

### For Players

1. **Tạo tài khoản**: Nhập tên khi bắt đầu game
2. **Chơi game**: Chơi PvP hoặc PvA mode
3. **Tự động lưu**: Điểm sẽ tự động lưu sau mỗi trận
4. **Xem ranking**: Click "🏆 BẢNG XẾP HẠNG" từ menu
5. **Cạnh tranh**: Cố gắng vượt qua top 3!

### For Guest Players

- Click "Chơi Khách" để chơi mà không lưu điểm
- Phù hợp cho người muốn thử nghiệm game

## 📊 Ranking Calculation

```javascript
// Win Rate Formula
winRate = (wins / totalGames) * 100

// Points Formula  
points = (wins * 2) + (draws * 1) + (losses * 0)

// Sorting Priority
1. Points (descending)
2. Win Rate (descending)
```

## 🎨 UI Features

- **Medal Icons**: 🥇 (1st), 🥈 (2nd), 🥉 (3rd)
- **Color Coding**: 
  - Gold for 1st place
  - Silver for 2nd place
  - Bronze for 3rd place
  - Cyan for current player
- **Glassmorphism**: Matching game's design theme
- **Responsive**: Mobile-friendly table layout

## ✨ Next Steps (Optional Enhancements)

- [ ] Add profile pictures/avatars
- [ ] Add match history (last 10 games)
- [ ] Add achievements/badges system
- [ ] Export/import leaderboard data
- [ ] Add filtering (by date, mode, etc.)
- [ ] Add statistics graphs/charts
- [ ] Multiplayer with real backend (Firebase/Supabase)

---

**Status**: ✅ Fully Functional  
**Testing**: Ready for user testing
