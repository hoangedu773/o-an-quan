/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Leaderboard screen showing player rankings
 */

import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { getLeaderboard, getCurrentPlayer } from '../../utils/leaderboard';

export default function LeaderboardScreen({ onBack }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    useEffect(() => {
        setLeaderboard(getLeaderboard());
        setCurrentPlayer(getCurrentPlayer());
    }, []);

    const getRankIcon = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const getRankColor = (rank) => {
        if (rank === 1) return 'text-yellow-300';
        if (rank === 2) return 'text-gray-300';
        if (rank === 3) return 'text-orange-400';
        return 'text-white';
    };

    return (
        <div className="glass w-full max-w-5xl mx-auto p-6 md:p-10 rounded-2xl shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-glow">
                🏆 Bảng Xếp Hạng
            </h2>
            <p className="text-center text-gray-300 mb-6">
                Top người chơi Ô Ăn Quan xuất sắc nhất
            </p>

            {/* Current Player Info */}
            {currentPlayer && (
                <div className="glass-dark p-4 rounded-xl mb-6 border-2 border-accent border-opacity-40">
                    <p className="text-center text-accent font-bold mb-2">👤 Bạn đang chơi với tên:</p>
                    <p className="text-center text-2xl font-black text-white">{currentPlayer.name}</p>
                    <div className="flex justify-center gap-6 mt-3 text-sm">
                        <span className="text-green-400">✅ {currentPlayer.wins} Thắng</span>
                        <span className="text-red-400">❌ {currentPlayer.losses} Thua</span>
                        <span className="text-yellow-400">🤝 {currentPlayer.draws} Hòa</span>
                        <span className="text-blue-400">⭐ {currentPlayer.points} Điểm</span>
                    </div>
                </div>
            )}

            {/* Leaderboard Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-white bg-opacity-10 border-b-2 border-white border-opacity-20">
                            <th className="px-4 py-3 text-left font-bold">Hạng</th>
                            <th className="px-4 py-3 text-left font-bold">Tên Người Chơi</th>
                            <th className="px-4 py-3 text-center font-bold hidden md:table-cell">Số Trận</th>
                            <th className="px-4 py-3 text-center font-bold">Thắng</th>
                            <th className="px-4 py-3 text-center font-bold hidden sm:table-cell">Thua</th>
                            <th className="px-4 py-3 text-center font-bold hidden sm:table-cell">Hòa</th>
                            <th className="px-4 py-3 text-center font-bold">Tỉ Lệ %</th>
                            <th className="px-4 py-3 text-center font-bold">Điểm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((player, index) => {
                            const isCurrentPlayer = currentPlayer && currentPlayer.id === player.id;
                            const rowClass = isCurrentPlayer
                                ? 'bg-accent bg-opacity-20 border-2 border-accent border-opacity-50'
                                : index % 2 === 0
                                    ? 'bg-white bg-opacity-5'
                                    : 'bg-white bg-opacity-10';

                            return (
                                <tr
                                    key={player.id}
                                    className={`${rowClass} hover:bg-opacity-20 transition-all`}
                                >
                                    <td className={`px-4 py-4 font-bold text-2xl ${getRankColor(player.rank)}`}>
                                        {getRankIcon(player.rank)}
                                    </td>
                                    <td className="px-4 py-4 font-semibold">
                                        {player.name}
                                        {isCurrentPlayer && (
                                            <span className="ml-2 text-xs bg-accent text-gray-900 px-2 py-1 rounded-full font-bold">
                                                YOU
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-center hidden md:table-cell">
                                        {player.totalGames}
                                    </td>
                                    <td className="px-4 py-4 text-center text-green-400 font-bold">
                                        {player.wins}
                                    </td>
                                    <td className="px-4 py-4 text-center text-red-400 hidden sm:table-cell">
                                        {player.losses}
                                    </td>
                                    <td className="px-4 py-4 text-center text-yellow-400 hidden sm:table-cell">
                                        {player.draws}
                                    </td>
                                    <td className="px-4 py-4 text-center font-semibold">
                                        {player.winRate}%
                                    </td>
                                    <td className="px-4 py-4 text-center font-bold text-accent text-lg">
                                        {player.points}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Scoring Info */}
            <div className="glass-dark p-4 rounded-xl mt-6">
                <p className="text-sm text-gray-300 text-center">
                    📊 <strong>Tính điểm:</strong> Thắng = +2 điểm | Hòa = +1 điểm | Thua = 0 điểm
                </p>
            </div>

            <Button
                variant="secondary"
                className="w-full mt-6"
                onClick={onBack}
            >
                ⬅️ QUAY LẠI MENU
            </Button>
        </div>
    );
}
