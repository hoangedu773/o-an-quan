/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Modal for entering player name
 */

import { useState } from 'react';
import Button from './Button';

export default function PlayerNameModal({ onSubmit, onSkip }) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Vui lòng nhập tên của bạn');
            return;
        }

        if (name.trim().length < 2) {
            setError('Tên phải có ít nhất 2 ký tự');
            return;
        }

        if (name.trim().length > 30) {
            setError('Tên không được quá 30 ký tự');
            return;
        }

        onSubmit(name.trim());
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass max-w-md w-full p-8 rounded-2xl border-4 border-accent border-opacity-40 shadow-2xl">
                <h2 className="text-3xl font-bold mb-4 text-center text-glow">
                    🎮 Nhập Tên Của Bạn
                </h2>

                <p className="text-gray-200 text-center mb-6">
                    Nhập tên để lưu điểm và tham gia bảng xếp hạng!
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError('');
                        }}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent mb-2"
                        autoFocus
                        maxLength={30}
                    />

                    {error && (
                        <p className="text-red-300 text-sm mb-4 bg-red-900 bg-opacity-30 p-2 rounded">
                            ⚠️ {error}
                        </p>
                    )}

                    <div className="flex gap-3 mt-6">
                        <Button type="submit" variant="accent" className="flex-1">
                            ✅ Bắt Đầu
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onSkip}
                            className="flex-1"
                        >
                            Chơi Khách
                        </Button>
                    </div>
                </form>

                <p className="text-xs text-gray-400 text-center mt-4">
                    💡 Chơi khách sẽ không lưu điểm vào bảng xếp hạng
                </p>
            </div>
        </div>
    );
}
