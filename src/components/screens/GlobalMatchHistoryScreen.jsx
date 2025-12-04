/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Global match history screen - anyone can view all matches
 */

import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { getAllMatches, getMatchStats } from '../../services/mockMatchService';

export default function GlobalMatchHistoryScreen({ onBack }) {
    const [matches, setMatches] = useState([]);
    const [stats, setStats] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'PvP', 'PvA', 'AvA'

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = () => {
        const allMatches = getAllMatches();
        setMatches(allMatches);
        setStats(getMatchStats());
    };

    const getFilteredMatches = () => {
        if (filter === 'all') return matches;
        return matches.filter(m => m.gameMode === filter);
    };

    const getResultBadge = (result) => {
        const badges = {
            win: { text: 'Thắng', color: 'bg-green-500' },
            loss: { text: 'Thua', color: 'bg-red-500' },
            draw: { text: 'Hòa', color: 'bg-yellow-500' },
        };
        const badge = badges[result] || badges.win;
        return (
            <span className={`${badge.color} text-white text-xs px-2 py-1 rounded-full font-bold`}>
                {badge.text}
            </span>
        );
    };

    const getGameModeBadge = (mode) => {
        const badges = {
            PvP: { text: 'PvP', color: 'bg-blue-500' },
            PvA: { text: 'PvA', color: 'bg-purple-500' },
            AvA: { text: 'AvA', color: 'bg-pink-500' },
        };
        const badge = badges[mode] || badges.PvP;
        return (
            <span className={`${badge.color} bg-opacity-80 text-white text-xs px-2 py-1 rounded font-semibold`}>
                {badge.text}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;

        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredMatches = getFilteredMatches();

    return (
        <div className="glass w-full max-w-6xl mx-auto p-6 md:p-8 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-glow mb-2">
                    📜 Lịch Sử Đấu Toàn Server
                </h2>
                <p className="text-gray-300">
                    Xem tất cả các trận đấu đã diễn ra
                </p>
            </div>

            {/* Statistics */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="glass-dark p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-accent">{stats.totalMatches}</div>
                        <div className="text-sm text-gray-300">Tổng trận</div>
                    </div>
                    <div className="glass-dark p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-blue-400">{stats.pvpMatches}</div>
                        <div className="text-sm text-gray-300">PvP</div>
                    </div>
                    <div className="glass-dark p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-purple-400">{stats.pvaMatches}</div>
                        <div className="text-sm text-gray-300">PvA</div>
                    </div>
                    <div className="glass-dark p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-pink-400">{stats.avaMatches}</div>
                        <div className="text-sm text-gray-300">AvA</div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'all'
                            ? 'bg-accent text-gray-900'
                            : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                        }`}
                >
                    Tất cả ({matches.length})
                </button>
                <button
                    onClick={() => setFilter('PvP')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'PvP'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                        }`}
                >
                    PvP ({matches.filter(m => m.gameMode === 'PvP').length})
                </button>
                <button
                    onClick={() => setFilter('PvA')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'PvA'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                        }`}
                >
                    PvA ({matches.filter(m => m.gameMode === 'PvA').length})
                </button>
                <button
                    onClick={() => setFilter('AvA')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === 'AvA'
                            ? 'bg-pink-500 text-white'
                            : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                        }`}
                >
                    AvA ({matches.filter(m => m.gameMode === 'AvA').length})
                </button>
            </div>

            {/* Match List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredMatches.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        <p className="text-4xl mb-2">🎮</p>
                        <p>Chưa có trận đấu nào</p>
                    </div>
                ) : (
                    filteredMatches.map((match) => (
                        <div
                            key={match.matchId}
                            className="glass-dark p-4 rounded-xl hover:bg-opacity-30 transition-all"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                {/* Match Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getGameModeBadge(match.gameMode)}
                                        <span className="text-xs text-gray-400">
                                            {formatDate(match.playedAt)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Player */}
                                        <div className="text-center">
                                            <div className="font-bold text-white">{match.playerName}</div>
                                            <div className="text-2xl font-black text-cyan-400">{match.playerScore}</div>
                                        </div>

                                        {/* VS */}
                                        <div className="text-gray-400 font-bold">VS</div>

                                        {/* Opponent */}
                                        <div className="text-center">
                                            <div className="font-bold text-white">{match.opponentName}</div>
                                            <div className="text-2xl font-black text-pink-400">{match.opponentScore}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Result Badge */}
                                <div className="flex items-center gap-2">
                                    {getResultBadge(match.result)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Back Button */}
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
