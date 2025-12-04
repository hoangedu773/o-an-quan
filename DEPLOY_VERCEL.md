# 🚀 Deploy Lên Vercel (FREE)

**Author**: hoangedu773

---

## ⚠️ QUAN TRỌNG: Bảo Mật

**KHÔNG BAO GIỜ** commit password/credentials lên Git!

File `.gitignore` đã bảo vệ:
- `.env` 
- `.env.local`

---

## 📋 Các Bước Deploy

### Bước 1: Push Code Lên GitHub

```bash
cd c:\work-space\O_an_quan
git init
git add .
git commit -m "feat: O An Quan multiplayer game"
git remote add origin https://github.com/YOUR_USERNAME/o-an-quan.git
git push -u origin main
```

### Bước 2: Deploy Frontend lên Vercel

1. Vào: https://vercel.com/new
2. Import repo từ GitHub
3. **Environment Variables**: Thêm `VITE_MONGODB_URI` = (MongoDB connection string của bạn)
4. Click **Deploy**

### Bước 3: Deploy Backend lên Render/Railway

Backend `server.js` cần host riêng (Vercel chỉ host static):

**Option A: Render.com (FREE)**
1. Vào https://render.com
2. New Web Service → connect GitHub repo
3. Build Command: `npm install`
4. Start Command: `node server.js`

**Option B: Railway.app**
1. Vào https://railway.app
2. New Project → Deploy from GitHub
3. Chọn repo

### Bước 4: Cập nhật Frontend

Sau khi backend deployed, cập nhật `socketService.js`:

```javascript
const SERVER_URL = 'https://your-backend-url.onrender.com';
```

---

## 🔐 Checklist Bảo Mật

- [ ] Không có password/key trong code
- [ ] `.env` đã được gitignore
- [ ] MongoDB IP whitelist: `0.0.0.0/0`
- [ ] Environment variables đã set trên hosting

---

## 📱 Kết Quả

Sau khi deploy:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.onrender.com`
- **Database**: MongoDB Atlas (cloud)

---

**Chúc deploy thành công!** 🎮
