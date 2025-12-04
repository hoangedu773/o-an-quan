/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Login screen component
 */

import { useState } from 'react';
import Button from '../ui/Button';
import { login } from '../../services/mockAuthService';

export default function LoginScreen({ onLoginSuccess, onSwitchToRegister, onSkip }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = login(email, password);

        setIsLoading(false);

        if (result.success) {
            onLoginSuccess(result.user);
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="glass w-full max-w-md mx-auto p-8 md:p-10 rounded-2xl shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-6">
                <div className="text-5xl mb-3">🎮</div>
                <h2 className="text-3xl font-bold text-glow mb-2">
                    Đăng Nhập
                </h2>
                <p className="text-gray-300 text-sm">
                    Chào mừng trở lại!
                </p>
            </div>

            {/* Demo Accounts */}
            <div className="glass-dark p-3 rounded-lg mb-4 text-xs">
                <p className="text-gray-300 mb-1">💡 <strong>Demo accounts:</strong></p>
                <p className="text-gray-400">Email: hoang@example.com | Pass: 123456</p>
                <p className="text-gray-400">Email: hoa@example.com | Pass: 123456</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        disabled={isLoading}
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
                        disabled={isLoading}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 bg-red-900 bg-opacity-30 border border-red-500 border-opacity-50 rounded-lg p-3">
                        <p className="text-red-200 text-sm">⚠️ {error}</p>
                    </div>
                )}

                {/* Login Button */}
                <Button
                    type="submit"
                    variant="accent"
                    className="w-full mb-3"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Đang đăng nhập...
                        </>
                    ) : (
                        '🔐 Đăng Nhập'
                    )}
                </Button>

                {/* Skip Button */}
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full mb-3"
                    onClick={onSkip}
                    disabled={isLoading}
                >
                    👤 Chơi Khách (Không lưu điểm)
                </Button>
            </form>

            {/* Switch to Register */}
            <div className="text-center mt-4">
                <p className="text-gray-300 text-sm">
                    Chưa có tài khoản?{' '}
                    <button
                        onClick={onSwitchToRegister}
                        className="text-accent hover:text-yellow-300 font-semibold underline"
                        disabled={isLoading}
                    >
                        Đăng ký ngay
                    </button>
                </p>
            </div>
        </div>
    );
}
