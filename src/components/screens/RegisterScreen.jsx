/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Register screen component
 */

import { useState } from 'react';
import Button from '../ui/Button';
import { register } from '../../services/mockAuthService';

export default function RegisterScreen({ onRegisterSuccess, onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        playerName: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.username || !formData.email || !formData.password || !formData.playerName) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (formData.username.length < 3) {
            setError('Tên đăng nhập phải có ít nhất 3 ký tự');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.playerName.length < 2) {
            setError('Tên hiển thị phải có ít nhất 2 ký tự');
            return;
        }

        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = register(
            formData.username,
            formData.email,
            formData.password,
            formData.playerName
        );

        setIsLoading(false);

        if (result.success) {
            onRegisterSuccess(result.user);
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="glass w-full max-w-md mx-auto p-8 md:p-10 rounded-2xl shadow-2xl">
            {/* Logo */}
            <div className="text-center mb-6">
                <div className="text-5xl mb-3">✨</div>
                <h2 className="text-3xl font-bold text-glow mb-2">
                    Đăng Ký
                </h2>
                <p className="text-gray-300 text-sm">
                    Tạo tài khoản mới để bắt đầu!
                </p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-200 mb-1">
                        Tên đăng nhập <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleChange('username', e.target.value)}
                        placeholder="username123"
                        className="w-full px-4 py-2.5 rounded-lg bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm"
                        disabled={isLoading}
                        maxLength={50}
                    />
                </div>

                {/* Email */}
                <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-200 mb-1">
                        Email <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="email@example.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm"
                        disabled={isLoading}
                    />
                </div>

                {/* Player Name */}
                <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-200 mb-1">
                        Tên hiển thị <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.playerName}
                        onChange={(e) => handleChange('playerName', e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-4 py-2.5 rounded-lg bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm"
                        disabled={isLoading}
                        maxLength={100}
                    />
                    <p className="text-xs text-gray-400 mt-1">Tên này sẽ hiển thị trong game</p>
                </div>

                {/* Password */}
                <div className="mb-3">
                    <label className="block text-sm font-semibold text-gray-200 mb-1">
                        Mật khẩu <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-lg bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm"
                        disabled={isLoading}
                    />
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-200 mb-1">
                        Xác nhận mật khẩu <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 rounded-lg bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm"
                        disabled={isLoading}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 bg-red-900 bg-opacity-30 border border-red-500 border-opacity-50 rounded-lg p-3">
                        <p className="text-red-200 text-sm">⚠️ {error}</p>
                    </div>
                )}

                {/* Register Button */}
                <Button
                    type="submit"
                    variant="accent"
                    className="w-full mb-3"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Đang tạo tài khoản...
                        </>
                    ) : (
                        '✨ Đăng Ký'
                    )}
                </Button>
            </form>

            {/* Switch to Login */}
            <div className="text-center mt-4">
                <p className="text-gray-300 text-sm">
                    Đã có tài khoản?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-accent hover:text-yellow-300 font-semibold underline"
                        disabled={isLoading}
                    >
                        Đăng nhập ngay
                    </button>
                </p>
            </div>
        </div>
    );
}
