/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Minimax AI algorithm with Alpha-Beta pruning
 */

import {
    PLAYER_X,
    PLAYER_O,
    PLAYER_X_SCORE_INDEX,
    PLAYER_O_SCORE_INDEX,
    BIG_STONE_VALUE,
    AI_PLAYER,
} from './constants';
import { getValidMoves, simulateMove, checkEndGame, calculateScore } from './gameLogic';

/**
 * Evaluate board state (heuristic function)
 */
function evaluateBoard(board, quanStones, player) {
    const scoreAI = calculateScore(board, quanStones, AI_PLAYER);
    const scoreHuman = calculateScore(board, quanStones, player === AI_PLAYER ? (AI_PLAYER === PLAYER_X ? PLAYER_O : PLAYER_X) : player);

    return scoreAI - scoreHuman;
}

/**
 * Minimax algorithm with Alpha-Beta pruning
 */
function minimax(board, quanStones, depth, isMaximizing, alpha, beta, currentPlayer, log = null) {
    // Terminal conditions
    if (depth === 0 || checkEndGame(quanStones)) {
        return evaluateBoard(board, quanStones, currentPlayer);
    }

    const validMoves = getValidMoves(board, currentPlayer);

    // No valid moves
    if (validMoves.length === 0) {
        return evaluateBoard(board, quanStones, currentPlayer);
    }

    const nextPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;

    if (isMaximizing) {
        let maxEval = -Infinity;

        for (const move of validMoves) {
            // Try both directions
            for (const direction of [-1, 1]) {
                const newState = simulateMove(board, quanStones, move, direction, currentPlayer);
                const evaluation = minimax(
                    newState.board,
                    newState.quanStones,
                    depth - 1,
                    false,
                    alpha,
                    beta,
                    nextPlayer,
                    log
                );

                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);

                if (beta <= alpha) {
                    break; // Beta cutoff
                }
            }

            if (beta <= alpha) {
                break;
            }
        }

        return maxEval;
    } else {
        let minEval = Infinity;

        for (const move of validMoves) {
            for (const direction of [-1, 1]) {
                const newState = simulateMove(board, quanStones, move, direction, currentPlayer);
                const evaluation = minimax(
                    newState.board,
                    newState.quanStones,
                    depth - 1,
                    true,
                    alpha,
                    beta,
                    nextPlayer,
                    log
                );

                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);

                if (beta <= alpha) {
                    break; // Alpha cutoff
                }
            }

            if (beta <= alpha) {
                break;
            }
        }

        return minEval;
    }
}

/**
 * Get best move for AI player
 */
export function getBestMove(board, quanStones, currentPlayer, depth, onLog = null) {
    const validMoves = getValidMoves(board, currentPlayer);

    if (validMoves.length === 0) {
        return null;
    }

    let bestMove = null;
    let bestScore = -Infinity;
    let moveCount = 0;

    if (onLog) {
        onLog(`🤖 AI đang tính toán... (Depth: ${depth})`, true);
        onLog(`📍 Các nước đi khả thi: [${validMoves.join(', ')}]`);
    }

    for (const move of validMoves) {
        for (const direction of [-1, 1]) {
            moveCount++;
            const directionName = direction === -1 ? 'Ngược' : 'Xuôi';

            const newState = simulateMove(board, quanStones, move, direction, currentPlayer);
            const score = minimax(
                newState.board,
                newState.quanStones,
                depth - 1,
                false,
                -Infinity,
                Infinity,
                currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X,
                onLog
            );

            if (onLog) {
                onLog(`  → Ô ${move} (${directionName}): Score = ${score}`);
            }

            if (score > bestScore) {
                bestScore = score;
                bestMove = { boxIndex: move, direction, score };
            }
        }
    }

    if (onLog && bestMove) {
        const dirName = bestMove.direction === -1 ? 'Ngược' : 'Xuôi';
        onLog(`✅ Chọn nước đi: Ô ${bestMove.boxIndex} (${dirName}) với Score ${bestScore}`, true);
        onLog(`📊 Đã đánh giá ${moveCount} nước đi khả thi.`);
    }

    return bestMove;
}
