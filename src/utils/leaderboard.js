/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Leaderboard and ranking system using localStorage
 */

const LEADERBOARD_KEY = 'oanquan_leaderboard';
const CURRENT_PLAYER_KEY = 'oanquan_current_player';

// Initial top 3 players (server seeded)
const INITIAL_LEADERBOARD = [
    {
        id: 1,
        name: 'Phạm Việt Hoàng',
        wins: 150,
        losses: 30,
        draws: 20,
        totalGames: 200,
        points: 320, // Win: 2 points, Draw: 1 point, Loss: 0 points
        winRate: 75.0,
        rank: 1,
    },
    {
        id: 2,
        name: 'Nguyễn Thái Hòa',
        wins: 120,
        losses: 40,
        draws: 15,
        totalGames: 175,
        points: 255,
        winRate: 68.57,
        rank: 2,
    },
    {
        id: 3,
        name: 'Nguyễn Ngọc Phi',
        wins: 100,
        losses: 50,
        draws: 25,
        totalGames: 175,
        points: 225,
        winRate: 57.14,
        rank: 3,
    },
];

/**
 * Initialize leaderboard with default data if not exists
 */
export function initializeLeaderboard() {
    const existing = localStorage.getItem(LEADERBOARD_KEY);
    if (!existing) {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(INITIAL_LEADERBOARD));
    }
}

/**
 * Get all players from leaderboard
 */
export function getLeaderboard() {
    initializeLeaderboard();
    const data = localStorage.getItem(LEADERBOARD_KEY);
    const players = JSON.parse(data);

    // Sort by points (descending), then by winRate
    return players.sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        return b.winRate - a.winRate;
    }).map((player, index) => ({
        ...player,
        rank: index + 1,
    }));
}

/**
 * Get current player info
 */
export function getCurrentPlayer() {
    const data = localStorage.getItem(CURRENT_PLAYER_KEY);
    return data ? JSON.parse(data) : null;
}

/**
 * Set current player
 */
export function setCurrentPlayer(playerName) {
    const leaderboard = getLeaderboard();
    let player = leaderboard.find(p => p.name === playerName);

    if (!player) {
        // Create new player
        player = {
            id: Date.now(),
            name: playerName,
            wins: 0,
            losses: 0,
            draws: 0,
            totalGames: 0,
            points: 0,
            winRate: 0,
            rank: leaderboard.length + 1,
        };

        leaderboard.push(player);
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    }

    localStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(player));
    return player;
}

/**
 * Update player stats after a game
 * @param {string} result - 'win', 'loss', or 'draw'
 */
export function updatePlayerStats(result) {
    const player = getCurrentPlayer();
    if (!player) return null;

    const leaderboard = getLeaderboard();
    const playerIndex = leaderboard.findIndex(p => p.id === player.id);

    if (playerIndex === -1) return null;

    const updatedPlayer = { ...leaderboard[playerIndex] };

    // Update stats
    updatedPlayer.totalGames += 1;

    if (result === 'win') {
        updatedPlayer.wins += 1;
        updatedPlayer.points += 2;
    } else if (result === 'loss') {
        updatedPlayer.losses += 1;
    } else if (result === 'draw') {
        updatedPlayer.draws += 1;
        updatedPlayer.points += 1;
    }

    // Calculate win rate
    updatedPlayer.winRate = ((updatedPlayer.wins / updatedPlayer.totalGames) * 100).toFixed(2);

    // Update in leaderboard
    leaderboard[playerIndex] = updatedPlayer;
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    localStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(updatedPlayer));

    return updatedPlayer;
}

/**
 * Get player rank
 */
export function getPlayerRank(playerId) {
    const leaderboard = getLeaderboard();
    const playerIndex = leaderboard.findIndex(p => p.id === playerId);
    return playerIndex !== -1 ? playerIndex + 1 : null;
}

/**
 * Clear current player
 */
export function clearCurrentPlayer() {
    localStorage.removeItem(CURRENT_PLAYER_KEY);
}

/**
 * Reset leaderboard to default
 */
export function resetLeaderboard() {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(INITIAL_LEADERBOARD));
    clearCurrentPlayer();
}
