/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Socket.io client for multiplayer connection
 */

import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://o-an-quan.onrender.com';

let socket = null;

export function connectToServer() {
    if (!socket) {
        socket = io(SERVER_URL, {
            transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
            console.log('✅ Connected to game server:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
        });

        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
    }
    return socket;
}

export function getSocket() {
    return socket || connectToServer();
}

export function disconnectFromServer() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}

// Matchmaking functions
export function findMatch(playerName) {
    const s = getSocket();
    s.emit('find_match', { name: playerName });
}

export function cancelMatchmaking() {
    const s = getSocket();
    s.emit('cancel_matchmaking');
}

// Game functions
export function makeMove(gameId, pitIndex, direction) {
    const s = getSocket();
    s.emit('make_move', { gameId, pitIndex, direction });
}

export function syncGameState(gameId, board, scores) {
    const s = getSocket();
    s.emit('sync_state', { gameId, board, scores });
}

export function endGame(gameId, winner, scores) {
    const s = getSocket();
    s.emit('game_ended', { gameId, winner, scores });
}

// Event listeners
export function onMatchFound(callback) {
    const s = getSocket();
    s.on('match_found', callback);
    return () => s.off('match_found', callback);
}

export function onWaitingForMatch(callback) {
    const s = getSocket();
    s.on('waiting_for_match', callback);
    return () => s.off('waiting_for_match', callback);
}

export function onOpponentMove(callback) {
    const s = getSocket();
    s.on('opponent_move', callback);
    return () => s.off('opponent_move', callback);
}

export function onTurnChanged(callback) {
    const s = getSocket();
    s.on('turn_changed', callback);
    return () => s.off('turn_changed', callback);
}

export function onStateSynced(callback) {
    const s = getSocket();
    s.on('state_synced', callback);
    return () => s.off('state_synced', callback);
}

export function onGameOver(callback) {
    const s = getSocket();
    s.on('game_over', callback);
    return () => s.off('game_over', callback);
}

export function onOpponentDisconnected(callback) {
    const s = getSocket();
    s.on('opponent_disconnected', callback);
    return () => s.off('opponent_disconnected', callback);
}

export function onError(callback) {
    const s = getSocket();
    s.on('error', callback);
    return () => s.off('error', callback);
}
