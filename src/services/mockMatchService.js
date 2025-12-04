/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Mock match history service - stores global match history
 */

const MATCH_HISTORY_KEY = 'oanquan_global_matches';

// Sample match history data
const INITIAL_MATCHES = [
    {
        matchId: 1,
        playerUserId: 1,
        playerName: 'Phạm Việt Hoàng',
        gameMode: 'PvA',
        opponentName: 'AI Minimax',
        playerScore: 45,
        opponentScore: 30,
        result: 'win',
        playedAt: new Date('2025-12-03T14:30:00').toISOString(),
    },
    {
        matchId: 2,
        playerUserId: 2,
        playerName: 'Nguyễn Thái Hòa',
        gameMode: 'PvA',
        opponentName: 'AI Minimax',
        playerScore: 38,
        opponentScore: 42,
        result: 'loss',
        playedAt: new Date('2025-12-03T15:20:00').toISOString(),
    },
    {
        matchId: 3,
        playerUserId: 1,
        playerName: 'Phạm Việt Hoàng',
        gameMode: 'PvP',
        opponentName: 'Nguyễn Thái Hòa',
        playerScore: 40,
        opponentScore: 40,
        result: 'draw',
        playedAt: new Date('2025-12-03T16:00:00').toISOString(),
    },
    {
        matchId: 4,
        playerUserId: 3,
        playerName: 'Nguyễn Ngọc Phi',
        gameMode: 'PvA',
        opponentName: 'AI Minimax',
        playerScore: 50,
        opponentScore: 35,
        result: 'win',
        playedAt: new Date('2025-12-04T10:15:00').toISOString(),
    },
    {
        matchId: 5,
        playerUserId: 2,
        playerName: 'Nguyễn Thái Hòa',
        gameMode: 'PvP',
        opponentName: 'Nguyễn Ngọc Phi',
        playerScore: 35,
        opponentScore: 38,
        result: 'loss',
        playedAt: new Date('2025-12-04T11:30:00').toISOString(),
    },
];

/**
 * Initialize match history
 */
export function initializeMatchHistory() {
    const existing = localStorage.getItem(MATCH_HISTORY_KEY);
    if (!existing) {
        localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(INITIAL_MATCHES));
    }
}

/**
 * Get all matches (global)
 */
export function getAllMatches() {
    initializeMatchHistory();
    const data = localStorage.getItem(MATCH_HISTORY_KEY);
    const matches = data ? JSON.parse(data) : INITIAL_MATCHES;

    // Sort by date (newest first)
    return matches.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));
}

/**
 * Get matches by user ID
 */
export function getMatchesByUserId(userId) {
    const matches = getAllMatches();
    return matches.filter(m => m.playerUserId === userId);
}

/**
 * Save new match
 */
export function saveMatch(matchData) {
    const matches = getAllMatches();

    const newMatch = {
        matchId: Date.now(),
        ...matchData,
        playedAt: new Date().toISOString(),
    };

    matches.push(newMatch);
    localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(matches));

    return newMatch;
}

/**
 * Get match statistics
 */
export function getMatchStats() {
    const matches = getAllMatches();

    return {
        totalMatches: matches.length,
        pvpMatches: matches.filter(m => m.gameMode === 'PvP').length,
        pvaMatches: matches.filter(m => m.gameMode === 'PvA').length,
        avaMatches: matches.filter(m => m.gameMode === 'AvA').length,
    };
}
