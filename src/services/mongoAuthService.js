/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: MongoDB Authentication Service
 */

import { getUsersCollection, getLeaderboardCollection } from '../config/mongodb.js';

/**
 * Initialize database with sample users
 */
export async function initializeAuthSystem() {
  try {
    const users = await getUsersCollection();
    const count = await users.countDocuments();
    
    if (count === 0) {
      // Insert initial users
      await users.insertMany([
        {
          username: 'phamviethoang',
          email: 'hoang@example.com',
          password: '123456', // In production, hash this!
          playerName: 'Phạm Việt Hoàng',
          createdAt: new Date('2025-11-01'),
        },
        {
          username: 'nguyenthaihoa',
          email: 'hoa@example.com',
          password: '123456',
          playerName: 'Nguyễn Thái Hòa',
          createdAt: new Date('2025-11-05'),
        },
        {
          username: 'nguyenngocphi',
          email: 'phi@example.com',
          password: '123456',
          playerName: 'Nguyễn Ngọc Phi',
          createdAt: new Date('2025-11-10'),
        },
      ]);
      
      // Initialize leaderboard stats
      const leaderboard = await getLeaderboardCollection();
      await leaderboard.insertMany([
        {
          userId: 1,
          playerName: 'Phạm Việt Hoàng',
          wins: 150,
          losses: 30,
          draws: 20,
          totalGames: 200,
          points: 320,
          winRate: 75.0,
        },
        {
          userId: 2,
          playerName: 'Nguyễn Thái Hòa',
          wins: 120,
          losses: 40,
          draws: 15,
          totalGames: 175,
          points: 255,
          winRate: 68.57,
        },
        {
          userId: 3,
          playerName: 'Nguyễn Ngọc Phi',
          wins: 100,
          losses: 50,
          draws: 25,
          totalGames: 175,
          points: 225,
          winRate: 57.14,
        },
      ]);
      
      console.log('✅ Database initialized with sample data');
    }
  } catch (error) {
    console.error('❌ Init error:', error);
  }
}

/**
 * Register new user
 */
export async function register(username, email, password, playerName) {
  try {
    const users = await getUsersCollection();
    
    // Check if email exists
    const existingEmail = await users.findOne({ email });
    if (existingEmail) {
      return { success: false, error: 'Email đã được sử dụng' };
    }
    
    // Check if username exists
    const existingUsername = await users.findOne({ username });
    if (existingUsername) {
      return { success: false, error: 'Tên đăng nhập đã được sử dụng' };
    }
    
    // Insert new user
    const result = await users.insertOne({
      username,
      email,
      password, // In production: bcrypt.hash(password, 10)
      playerName,
      createdAt: new Date(),
    });
    
    // Initialize leaderboard entry
    const leaderboard = await getLeaderboardCollection();
    await leaderboard.insertOne({
      userId: result.insertedId,
      playerName,
      wins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0,
      points: 0,
      winRate: 0,
    });
    
    const newUser = {
      userId: result.insertedId,
      username,
      email,
      playerName,
      createdAt: new Date(),
    };
    
    // Save to session storage (browser)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mongodb_auth_user', JSON.stringify(newUser));
    }
    
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, error: 'Lỗi server' };
  }
}

/**
 * Login user
 */
export async function login(email, password) {
  try {
    const users = await getUsersCollection();
    
    const user = await users.findOne({ email, password });
    
    if (!user) {
      return { success: false, error: 'Email hoặc mật khẩu không đúng' };
    }
    
    const publicUser = {
      userId: user._id,
      username: user.username,
      email: user.email,
      playerName: user.playerName,
      createdAt: user.createdAt,
    };
    
    // Save to session storage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mongodb_auth_user', JSON.stringify(publicUser));
    }
    
    return { success: true, user: publicUser };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Lỗi server' };
  }
}

/**
 * Logout
 */
export function logout() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('mongodb_auth_user');
  }
}

/**
 * Get current user from session
 */
export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const data = sessionStorage.getItem('mongodb_auth_user');
    return data ? JSON.parse(data) : null;
  }
  return null;
}

/**
 * Check if logged in
 */
export function isLoggedIn() {
  return getCurrentUser() !== null;
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
  try {
    const users = await getUsersCollection();
    const user = await users.findOne({ _id: userId });
    
    if (user) {
      return {
        userId: user._id,
        username: user.username,
        email: user.email,
        playerName: user.playerName,
      };
    }
    return null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}
