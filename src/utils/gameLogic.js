/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-05
 * Description: Core game logic functions for O An Quan
 */

import {
    BOARD_SIZE,
    QUAN_BOXES,
    PLAYER_X_BOXES,
    PLAYER_O_BOXES,
    PLAYER_X_SCORE_INDEX,
    PLAYER_O_SCORE_INDEX,
    BIG_STONE_VALUE,
    PLAYER_X,
    PLAYER_O,
    QUAN_O_INDEX,
    QUAN_X_INDEX,
} from './constants';

/**
 * Board visual layout:
 * 
 * [Quan Left=0]  [5][4][3][2][1]  [Quan Right=6]
 *                [7][8][9][10][11]
 * 
 * Counter-clockwise (⬅️ LEFT): 7 → 0 → 5 → 4 → 3 → 2 → 1 → 6 → 11 → 10 → 9 → 8 → 7
 * Clockwise (➡️ RIGHT): 7 → 8 → 9 → 10 → 11 → 6 → 1 → 2 → 3 → 4 → 5 → 0 → 7
 */
const COUNTER_CLOCKWISE = [7, 0, 5, 4, 3, 2, 1, 6, 11, 10, 9, 8];
const CLOCKWISE = [7, 8, 9, 10, 11, 6, 1, 2, 3, 4, 5, 0];

/**
 * Get next index following circular board order
 * direction: -1 = counter-clockwise (left), 1 = clockwise (right)
 */
export function getNextIndex(currentIndex, direction) {
    const order = direction === -1 ? COUNTER_CLOCKWISE : CLOCKWISE;
    const currentPos = order.indexOf(currentIndex);
    if (currentPos === -1) return currentIndex;

    const nextPos = (currentPos + 1) % order.length;
    return order[nextPos];
}

/**
 * Check if player needs to redistribute
 */
export function checkNeedSow(board, currentPlayer) {
    const playerBoxes = currentPlayer === PLAYER_X ? PLAYER_X_BOXES : PLAYER_O_BOXES;
    return playerBoxes.every(index => board[index] === 0);
}

/**
 * Check if game has ended
 */
export function checkEndGame(quanStones) {
    return quanStones[0] === 0 && quanStones[1] === 0;
}

/**
 * Calculate score
 */
export function calculateScore(board, quanStones, player) {
    const scoreIndex = player === PLAYER_X ? PLAYER_X_SCORE_INDEX : PLAYER_O_SCORE_INDEX;
    return board[scoreIndex];
}

/**
 * Get valid moves
 */
export function getValidMoves(board, currentPlayer) {
    const playerBoxes = currentPlayer === PLAYER_X ? PLAYER_X_BOXES : PLAYER_O_BOXES;
    return playerBoxes.filter(index => board[index] > 0);
}

/**
 * Clone game state
 */
export function cloneGameState(board, quanStones) {
    return {
        board: [...board],
        quanStones: [...quanStones],
    };
}

/**
 * Check if cell has stones
 */
function cellHasStones(board, quanStones, index) {
    if (QUAN_BOXES.includes(index)) {
        const quanIdx = index === QUAN_O_INDEX ? 0 : 1;
        return board[index] > 0 || quanStones[quanIdx] > 0;
    }
    return board[index] > 0;
}

/**
 * Simulate a move
 */
export function simulateMove(board, quanStones, startIndex, direction, currentPlayer) {
    const newBoard = [...board];
    const newQuanStones = [...quanStones];

    const playerScoreIndex = currentPlayer === PLAYER_X ? PLAYER_X_SCORE_INDEX : PLAYER_O_SCORE_INDEX;

    let stonesToSow = newBoard[startIndex];
    newBoard[startIndex] = 0;
    let currentIndex = startIndex;

    while (true) {
        // Sow
        while (stonesToSow > 0) {
            currentIndex = getNextIndex(currentIndex, direction);
            newBoard[currentIndex]++;
            stonesToSow--;
        }

        // Check next
        let nextIndex = getNextIndex(currentIndex, direction);

        // Stop at Quan
        if (QUAN_BOXES.includes(nextIndex)) {
            break;
        }

        // Pick up if has stones
        if (newBoard[nextIndex] > 0) {
            stonesToSow = newBoard[nextIndex];
            newBoard[nextIndex] = 0;
            currentIndex = nextIndex;
            continue;
        }

        // Capture if next is empty
        if (newBoard[nextIndex] === 0) {
            let captureIndex = getNextIndex(nextIndex, direction);

            while (cellHasStones(newBoard, newQuanStones, captureIndex)) {
                newBoard[playerScoreIndex] += newBoard[captureIndex];
                newBoard[captureIndex] = 0;

                if (QUAN_BOXES.includes(captureIndex)) {
                    const quanIdx = captureIndex === QUAN_O_INDEX ? 0 : 1;
                    if (newQuanStones[quanIdx] > 0) {
                        newBoard[playerScoreIndex] += BIG_STONE_VALUE;
                        newQuanStones[quanIdx] = 0;
                    }
                }

                let nextEmptyCheck = getNextIndex(captureIndex, direction);
                if (newBoard[nextEmptyCheck] > 0 || QUAN_BOXES.includes(nextEmptyCheck)) break;

                let nextCaptureCheck = getNextIndex(nextEmptyCheck, direction);
                if (cellHasStones(newBoard, newQuanStones, nextCaptureCheck)) {
                    captureIndex = nextCaptureCheck;
                } else {
                    break;
                }
            }
        }

        break;
    }

    return { board: newBoard, quanStones: newQuanStones };
}

/**
 * Calculate final state
 */
export function calculateFinalState(board, quanStones) {
    const finalBoard = [...board];

    let playerXRemaining = 0;
    let playerORemaining = 0;

    PLAYER_X_BOXES.forEach(i => { playerXRemaining += finalBoard[i]; finalBoard[i] = 0; });
    PLAYER_O_BOXES.forEach(i => { playerORemaining += finalBoard[i]; finalBoard[i] = 0; });

    finalBoard[PLAYER_X_SCORE_INDEX] += playerXRemaining;
    finalBoard[PLAYER_O_SCORE_INDEX] += playerORemaining;

    return {
        board: finalBoard,
        quanStones: [...quanStones],
        scores: {
            X: finalBoard[PLAYER_X_SCORE_INDEX],
            O: finalBoard[PLAYER_O_SCORE_INDEX]
        }
    };
}

/**
 * Determine winner from scores
 */
export function getWinner(scores) {
    if (scores.X > scores.O) return PLAYER_X;
    if (scores.O > scores.X) return PLAYER_O;
    return 'draw';
}
