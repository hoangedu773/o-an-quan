/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Backend server for O An Quan multiplayer - Express + Socket.io
 */

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// ============== DATA STORES ==============
const waitingQueue = [];  // Players waiting for match
const activeGames = new Map();  // gameId -> gameState
const playerSockets = new Map();  // odingplayerId -> socket

// ============== HELPER FUNCTIONS ==============
function generateGameId() {
    return 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function createInitialGameState(player1, player2) {
    return {
        board: [5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 0], // Standard O An Quan board
        player1: {
            id: player1.id,
            name: player1.name,
            score: 0,
            side: 'bottom' // indexes 0-4
        },
        player2: {
            id: player2.id,
            name: player2.name,
            score: 0,
            side: 'top' // indexes 6-10
        },
        currentTurn: player1.id,
        status: 'playing',
        winner: null,
        createdAt: new Date()
    };
}

// ============== SOCKET EVENTS ==============
io.on('connection', (socket) => {
    console.log(`🔵 Player connected: ${socket.id}`);

    // Player joins matchmaking queue
    socket.on('find_match', (playerData) => {
        const player = {
            id: socket.id,
            name: playerData.name || 'Người chơi ẩn danh',
            socket: socket
        };

        console.log(`🔍 ${player.name} đang tìm trận...`);
        playerSockets.set(socket.id, player);

        // Check if someone is waiting
        if (waitingQueue.length > 0) {
            const opponent = waitingQueue.shift();

            // Create game
            const gameId = generateGameId();
            const gameState = createInitialGameState(opponent, player);
            activeGames.set(gameId, gameState);

            // Join both players to game room
            opponent.socket.join(gameId);
            socket.join(gameId);

            console.log(`🎮 Match found! ${opponent.name} vs ${player.name}`);

            // Notify both players
            opponent.socket.emit('match_found', {
                gameId,
                opponent: { id: player.id, name: player.name },
                yourSide: 'bottom',
                isYourTurn: true,
                gameState
            });

            socket.emit('match_found', {
                gameId,
                opponent: { id: opponent.id, name: opponent.name },
                yourSide: 'top',
                isYourTurn: false,
                gameState
            });

        } else {
            // Add to queue
            waitingQueue.push(player);
            socket.emit('waiting_for_match', {
                position: waitingQueue.length,
                message: 'Đang tìm đối thủ...'
            });
        }
    });

    // Player makes a move
    socket.on('make_move', ({ gameId, pitIndex, direction }) => {
        const game = activeGames.get(gameId);
        if (!game) {
            socket.emit('error', { message: 'Game không tồn tại' });
            return;
        }

        if (game.currentTurn !== socket.id) {
            socket.emit('error', { message: 'Chưa đến lượt bạn!' });
            return;
        }

        console.log(`🎯 Move: pit ${pitIndex}, direction ${direction}`);

        // Broadcast move to opponent
        socket.to(gameId).emit('opponent_move', { pitIndex, direction });

        // Switch turn
        game.currentTurn = game.currentTurn === game.player1.id
            ? game.player2.id
            : game.player1.id;

        // Notify turn change
        io.to(gameId).emit('turn_changed', {
            currentTurn: game.currentTurn,
            gameState: game
        });
    });

    // Sync game state (called after animation complete)
    socket.on('sync_state', ({ gameId, board, scores }) => {
        const game = activeGames.get(gameId);
        if (game) {
            game.board = board;
            game.player1.score = scores.player1;
            game.player2.score = scores.player2;

            // Broadcast to opponent
            socket.to(gameId).emit('state_synced', { board, scores });
        }
    });

    // Game ended
    socket.on('game_ended', ({ gameId, winner, scores }) => {
        const game = activeGames.get(gameId);
        if (game) {
            game.status = 'ended';
            game.winner = winner;

            io.to(gameId).emit('game_over', { winner, scores });

            // Cleanup after 5 seconds
            setTimeout(() => {
                activeGames.delete(gameId);
            }, 5000);
        }
    });

    // Cancel matchmaking
    socket.on('cancel_matchmaking', () => {
        const index = waitingQueue.findIndex(p => p.id === socket.id);
        if (index !== -1) {
            waitingQueue.splice(index, 1);
            console.log(`❌ Player ${socket.id} cancelled matchmaking`);
        }
    });

    // Player disconnects
    socket.on('disconnect', () => {
        console.log(`🔴 Player disconnected: ${socket.id}`);

        // Remove from queue
        const queueIndex = waitingQueue.findIndex(p => p.id === socket.id);
        if (queueIndex !== -1) {
            waitingQueue.splice(queueIndex, 1);
        }

        // Notify opponent if in game
        for (const [gameId, game] of activeGames) {
            if (game.player1.id === socket.id || game.player2.id === socket.id) {
                io.to(gameId).emit('opponent_disconnected', {
                    message: 'Đối thủ đã thoát game!'
                });
                activeGames.delete(gameId);
                break;
            }
        }

        playerSockets.delete(socket.id);
    });
});

// ============== REST API ==============
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        waitingPlayers: waitingQueue.length,
        activeGames: activeGames.size
    });
});

app.get('/stats', (req, res) => {
    res.json({
        waitingPlayers: waitingQueue.length,
        activeGames: activeGames.size,
        connectedPlayers: playerSockets.size
    });
});

// ============== START SERVER ==============
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║   🎮 O An Quan Multiplayer Server         ║
║   Running on http://localhost:${PORT}        ║
║   Author: hoangedu773                     ║
╚═══════════════════════════════════════════╝
    `);
});
