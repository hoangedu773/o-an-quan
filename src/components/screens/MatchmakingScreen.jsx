/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Matchmaking screen - finding opponent
 */

import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import {
    connectToServer,
    findMatch,
    cancelMatchmaking,
    onMatchFound,
    onWaitingForMatch,
    onOpponentDisconnected
} from '../../services/socketService';

export default function MatchmakingScreen({ playerName, onMatchFound: onMatch, onCancel }) {
    const [status, setStatus] = useState('connecting');
    const [dots, setDots] = useState('');
    const [searchTime, setSearchTime] = useState(0);

    useEffect(() => {
        // Connect to server
        connectToServer();
        setStatus('searching');

        // Start searching
        findMatch(playerName);

        // Animate dots
        const dotsInterval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        // Search timer
        const timerInterval = setInterval(() => {
            setSearchTime(prev => prev + 1);
        }, 1000);

        // Listen for match
        const unsubMatch = onMatchFound((data) => {
            setStatus('found');
            setTimeout(() => {
                onMatch(data);
            }, 1000);
        });

        const unsubWaiting = onWaitingForMatch((data) => {
            setStatus('searching');
        });

        const unsubDisconnect = onOpponentDisconnected((data) => {
            setStatus('disconnected');
        });

        return () => {
            clearInterval(dotsInterval);
            clearInterval(timerInterval);
            unsubMatch();
            unsubWaiting();
            unsubDisconnect();
        };
    }, [playerName, onMatch]);

    const handleCancel = () => {
        cancelMatchmaking();
        onCancel();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass w-full max-w-md mx-auto p-8 rounded-2xl shadow-2xl text-center">
            {/* Header */}
            <div className="text-6xl mb-4">
                {status === 'connecting' && '🔌'}
                {status === 'searching' && '🔍'}
                {status === 'found' && '🎮'}
                {status === 'disconnected' && '❌'}
            </div>

            <h2 className="text-2xl font-bold text-glow mb-2">
                {status === 'connecting' && 'Đang kết nối...'}
                {status === 'searching' && `Đang tìm đối thủ${dots}`}
                {status === 'found' && 'Đã tìm thấy đối thủ!'}
                {status === 'disconnected' && 'Mất kết nối'}
            </h2>

            {/* Player Info */}
            <div className="glass-dark p-4 rounded-lg mb-6">
                <p className="text-gray-300 text-sm mb-1">Bạn đang chơi với tên:</p>
                <p className="text-xl font-bold text-accent">{playerName}</p>
            </div>

            {/* Search Animation */}
            {status === 'searching' && (
                <div className="mb-6">
                    {/* Spinning radar */}
                    <div className="relative w-32 h-32 mx-auto mb-4">
                        <div className="absolute inset-0 border-4 border-accent border-opacity-30 rounded-full"></div>
                        <div className="absolute inset-2 border-4 border-accent border-opacity-20 rounded-full"></div>
                        <div className="absolute inset-4 border-4 border-accent border-opacity-10 rounded-full"></div>
                        <div
                            className="absolute inset-0 border-t-4 border-accent rounded-full animate-spin"
                            style={{ animationDuration: '1.5s' }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl">👤</span>
                        </div>
                    </div>

                    {/* Timer */}
                    <p className="text-gray-400 text-sm">
                        Thời gian tìm: <span className="text-white font-mono">{formatTime(searchTime)}</span>
                    </p>
                </div>
            )}

            {/* Match Found Animation */}
            {status === 'found' && (
                <div className="mb-6">
                    <div className="flex items-center justify-center gap-4">
                        <div className="text-4xl animate-bounce">👤</div>
                        <div className="text-2xl text-accent">⚔️</div>
                        <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>👤</div>
                    </div>
                    <p className="text-green-400 mt-4 font-semibold">Chuẩn bị vào trận!</p>
                </div>
            )}

            {/* Cancel Button */}
            {status === 'searching' && (
                <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="w-full"
                >
                    ❌ Hủy tìm trận
                </Button>
            )}

            {status === 'disconnected' && (
                <Button
                    variant="primary"
                    onClick={onCancel}
                    className="w-full"
                >
                    🔙 Quay lại menu
                </Button>
            )}

            {/* Tips */}
            {status === 'searching' && (
                <p className="text-gray-500 text-xs mt-4">
                    💡 Tip: Mở game trên thiết bị khác để test multiplayer
                </p>
            )}
        </div>
    );
}
