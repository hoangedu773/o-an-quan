/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Main Menu screen component with leaderboard and match history
 */

import { useState } from 'react';
import Button from '../ui/Button';

export default function MainMenu({ onGameModeSelect, onShowInstructions, onShowLeaderboard, onShowMatchHistory }) {
    const [showModes, setShowModes] = useState(false);

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
            {showModes && (
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
                            onClick={() => onGameModeSelect('PvA')}
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
                className="w-full mb-4 bg-purple-600 hover:bg-purple-700"
                onClick={onShowMatchHistory}
            >
                📜 LỊCH SỬ ĐẤU
            </Button>

            {/* Help Button */}
            <Button
                variant="secondary"
                className="w-full mb-4"
                onClick={onShowInstructions}
            >
                📖 TRỢ GIÚP (Hướng dẫn cách chơi)
            </Button>

            {/* Info */}
            <div className="text-center text-sm text-gray-300 mt-6">
                <p>Trò chơi dân gian Việt Nam</p>
                <p className="mt-1">💻 Demo thuật toán AI Minimax</p>
            </div>
        </div>
    );
}
