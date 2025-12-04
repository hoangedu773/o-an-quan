/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Mock authentication service using localStorage
 */

const AUTH_STORAGE_KEY = 'oanquan_auth_user';
const USERS_STORAGE_KEY = 'oanquan_all_users';

// Initialize with some fake users
const INITIAL_USERS = [
    {
        userId: 1,
        username: 'phamviethoang',
        email: 'hoang@example.com',
        password: '123456', // In real app, this would be hashed
        playerName: 'Phạm Việt Hoàng',
        createdAt: new Date('2025-11-01').toISOString(),
    },
    {
        userId: 2,
        username: 'nguyenthaihoa',
        email: 'hoa@example.com',
        password: '123456',
        playerName: 'Nguyễn Thái Hòa',
        createdAt: new Date('2025-11-05').toISOString(),
    },
    {
        userId: 3,
        username: 'nguyenngocphi',
        email: 'phi@example.com',
        password: '123456',
        playerName: 'Nguyễn Ngọc Phi',
        createdAt: new Date('2025-11-10').toISOString(),
    },
];

/**
 * Initialize users in localStorage
 */
export function initializeAuthSystem() {
    const existing = localStorage.getItem(USERS_STORAGE_KEY);
    if (!existing) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    }
}

/**
 * Get all users
 */
function getAllUsers() {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_USERS;
}

/**
 * Save users
 */
function saveUsers(users) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

/**
 * Register new user
 */
export function register(username, email, password, playerName) {
    const users = getAllUsers();

    // Check if email exists
    if (users.find(u => u.email === email)) {
        return {
            success: false,
            error: 'Email đã được sử dụng'
        };
    }

    // Check if username exists
    if (users.find(u => u.username === username)) {
        return {
            success: false,
            error: 'Tên đăng nhập đã được sử dụng'
        };
    }

    // Create new user
    const newUser = {
        userId: Date.now(), // Simple ID generation
        username,
        email,
        password, // In real app, hash this
        playerName,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after register
    const publicUser = { ...newUser };
    delete publicUser.password;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(publicUser));

    return {
        success: true,
        user: publicUser
    };
}

/**
 * Login user
 */
export function login(email, password) {
    const users = getAllUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return {
            success: false,
            error: 'Email hoặc mật khẩu không đúng'
        };
    }

    // Save to auth storage (without password)
    const publicUser = { ...user };
    delete publicUser.password;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(publicUser));

    return {
        success: true,
        user: publicUser
    };
}

/**
 * Logout
 */
export function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Get current logged in user
 */
export function getCurrentUser() {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

/**
 * Check if user is logged in
 */
export function isLoggedIn() {
    return getCurrentUser() !== null;
}

/**
 * Get user by userId
 */
export function getUserById(userId) {
    const users = getAllUsers();
    const user = users.find(u => u.userId === userId);
    if (user) {
        const publicUser = { ...user };
        delete publicUser.password;
        return publicUser;
    }
    return null;
}
