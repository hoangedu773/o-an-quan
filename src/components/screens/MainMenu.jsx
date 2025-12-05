/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-05
 * Description: Main Menu with AI difficulty selection
 */

import { useState } from 'react';
import Button from '../ui/Button';

export default function MainMenu({ onGameModeSelect, onShowInstructions, onShowLeaderboard, onShowMatchHistory }) {
    const [showModes, setShowModes] = useState(false);
    const [showDifficulty, setShowDifficulty] = useState(false);

    const handleAIMode = () => {
        setShowDifficulty(true);
    };

    const handleDifficultySelect = (difficulty) => {
        onGameModeSelect('PvA', difficulty);
        setShowDifficulty(false);
        setShowModes(false);
    };

    return (
        <div className="glass w-full max-w-2xl mx-auto p-8 md:p-12 rounded-2xl shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-glow">
                Menu Chính
            </h2>

            {/* Start Game Button */}
            {!showModes && (
                <Button
                    variant="accent"
                    className="w-full mb-4"
                    onClick={() => setShowModes(true)}
                >
                    🎮 BẮT ĐẦU TRÒ CHƠI
                </Button>
            )}

            {/* Game Modes */}
            {showModes && !showDifficulty && (
                <div className="bg-blue-500 bg-opacity-20 border-2 border-blue-300 border-opacity-40 rounded-xl p-6 mb-4 backdrop-blur-sm">
                    <p className="font-semibold text-blue-100 mb-4 text-center">
                        Chọn Chế Độ Chơi:
                    </p>
                    <div className="space-y-3">
                        {/* ONLINE MULTIPLAYER - NEW! */}
                        <Button
                            variant="accent"
                            className="w-full animate-pulse"
                            onClick={() => onGameModeSelect('online')}
                        >
                            🌐 ONLINE - Tìm Đối Thủ (NEW!)
                        </Button>

                        <div className="border-t border-white border-opacity-20 my-3"></div>

                        <Button
                            variant="success"
                            className="w-full"
                            onClick={() => onGameModeSelect('PvP')}
                        >
                            👥 Người vs Người (Cùng máy)
                        </Button>
                        <Button
                            variant="primary"
                            className="w-full bg-yellow-500 hover:bg-yellow-600"
                            onClick={handleAIMode}
                        >
                            🤖 Người vs Máy (AI Minimax)
                        </Button>
                        <Button
                            variant="primary"
                            className="w-full bg-purple-500 hover:bg-purple-600"
                            onClick={() => onGameModeSelect('AvA')}
                        >
                            🎬 Máy vs Máy (AI Demo)
                        </Button>
                    </div>
                </div>
            )}

            {/* AI Difficulty Selection */}
            {showDifficulty && (
                <div className="bg-yellow-500 bg-opacity-20 border-2 border-yellow-300 border-opacity-40 rounded-xl p-6 mb-4 backdrop-blur-sm">
                    <p className="font-semibold text-yellow-100 mb-4 text-center">
                        🤖 Chọn Độ Khó AI:
                    </p>
                    <div className="space-y-3">
                        <Button
                            variant="success"
                            className="w-full"
                            onClick={() => handleDifficultySelect('easy')}
                        >
                            😊 DỄ - AI Ngốc (Depth 2)
                        </Button>
                        <Button
                            variant="primary"
                            className="w-full bg-orange-500 hover:bg-orange-600"
                            onClick={() => handleDifficultySelect('medium')}
                        >
                            🧐 TRUNG BÌNH - AI Khôn (Depth 4)
                        </Button>
                        <Button
                            variant="danger"
                            className="w-full"
                            onClick={() => handleDifficultySelect('hard')}
                        >
                            💀 KHÓ - AI Thiên Tài (Depth 6)
                        </Button>
                        <div className="border-t border-white border-opacity-20 my-2"></div>
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => {
                                setShowDifficulty(false);
                            }}
                        >
                            ← Quay lại
                        </Button>
                    </div>
                </div>
            )}

            {/* Leaderboard Button */}
            <Button
                variant="primary"
                className="w-full mb-4"
                onClick={onShowLeaderboard}
            >
                🏆 BẢNG XẾP HẠNG
            </Button>

            {/* Match History Button */}
            <Button
                variant="primary"
                className="w-full mb-4 bg-indigo-500 hover:bg-indigo-600"
                onClick={onShowMatchHistory}
            >
                📜 LỊCH SỬ ĐẤU
            </Button>

            {/* Instructions Button */}
            <Button
                variant="secondary"
                className="w-full"
                onClick={onShowInstructions}
            >
                📖 HƯỚNG DẪN
            </Button>
        </div>
    );
}
