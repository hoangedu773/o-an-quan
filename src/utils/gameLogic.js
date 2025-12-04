/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Core game logic functions for O An Quan
 */

import {
    BOARD_SIZE,
    QUAN_BOXES,
    PLAYER_X_BOXES,
    PLAYER_O_BOXES,
    PLAYER_X_SCORE_INDEX,
    PLAYER_O_SCORE_INDEX,
    MINOR_BOX_COUNT,
    BIG_STONE_VALUE,
    PLAYER_X,
    PLAYER_O,
} from './constants';

/**
 * Get next index with wrapping
 */
export function getNextIndex(currentIndex, direction) {
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) {
        nextIndex = BOARD_SIZE - 1;
    } else if (nextIndex >= BOARD_SIZE) {
        nextIndex = 0;
    }
    return nextIndex;
}

/**
 * Check if player needs to "Gieo" (sow from score)
 */
export function checkNeedSow(board, currentPlayer) {
    const playerBoxes = currentPlayer === PLAYER_X ? PLAYER_X_BOXES : PLAYER_O_BOXES;
    return playerBoxes.every(index => board[index] === 0);
}

/**
 * Check if game has ended (both Quan stones are gone)
 */
export function checkEndGame(quanStones) {
    return quanStones[0] === 0 && quanStones[1] === 0;
}

/**
 * Calculate total score for a player
 */
export function calculateScore(board, quanStones, player) {
    const scoreIndex = player === PLAYER_X ? PLAYER_X_SCORE_INDEX : PLAYER_O_SCORE_INDEX;
    const quanIndex = player === PLAYER_X ? 1 : 0;
    return board[scoreIndex] + (quanStones[quanIndex] * BIG_STONE_VALUE);
}

/**
 * Get valid moves for current player
 */
export function getValidMoves(board, currentPlayer) {
    const playerBoxes = currentPlayer === PLAYER_X ? PLAYER_X_BOXES : PLAYER_O_BOXES;
    return playerBoxes.filter(index => board[index] > 0);
}

/**
 * Deep clone game state
 */
export function cloneGameState(board, quanStones) {
    return {
        board: [...board],
        quanStones: [...quanStones],
    };
}

/**
 * Simulate a complete move (sow and capture) and return new state
 * This is used for AI calculation
 */
export function simulateMove(board, quanStones, startIndex, direction, currentPlayer) {
    const newState = cloneGameState(board, quanStones);
    const newBoard = newState.board;
    const newQuanStones = newState.quanStones;

    const opponentScoreIndex = currentPlayer === PLAYER_X ? PLAYER_O_SCORE_INDEX : PLAYER_X_SCORE_INDEX;
    const playerScoreIndex = currentPlayer === PLAYER_X ? PLAYER_X_SCORE_INDEX : PLAYER_O_SCORE_INDEX;

    let stonesToSow = newBoard[startIndex];
    newBoard[startIndex] = 0;
    let currentIndex = startIndex;

    // Sowing phase
    while (stonesToSow > 0) {
        currentIndex = getNextIndex(currentIndex, direction);

        // Skip opponent's Quan box
        if (currentIndex === opponentScoreIndex) {
            continue;
        }

        newBoard[currentIndex]++;
        stonesToSow--;
    }

    // Capture phase
    let lastIndex = currentIndex;

    while (true) {
        // If landed on non-empty box (not a Quan box), scoop and continue
        if (!QUAN_BOXES.includes(lastIndex) && newBoard[lastIndex] > 1) {
            stonesToSow = newBoard[lastIndex];
            newBoard[lastIndex] = 0;

            // Continue sowing
            currentIndex = lastIndex;
            while (stonesToSow > 0) {
                currentIndex = getNextIndex(currentIndex, direction);

                if (currentIndex === opponentScoreIndex) {
                    continue;
                }

                newBoard[currentIndex]++;
                stonesToSow--;
            }

            lastIndex = currentIndex;
        }
        // If landed on empty box, try to capture
        else if (!QUAN_BOXES.includes(lastIndex) && newBoard[lastIndex] === 1) {
            let captureIndex = getNextIndex(lastIndex, direction);

            // Capture from next box and the one after
            while (newBoard[captureIndex] > 0 || (QUAN_BOXES.includes(captureIndex) && newQuanStones[QUAN_BOXES.indexOf(captureIndex)] > 0)) {
                // Capture regular stones
                newBoard[playerScoreIndex] += newBoard[captureIndex];
                newBoard[captureIndex] = 0;

                // Capture Quan stone if present
                if (QUAN_BOXES.includes(captureIndex)) {
                    const quanIdx = QUAN_BOXES.indexOf(captureIndex);
                    if (newQuanStones[quanIdx] > 0) {
                        newBoard[playerScoreIndex] += BIG_STONE_VALUE;
                        newQuanStones[quanIdx] = 0;
                    }
                }

                // Move to next box for potential second capture
                const nextCaptureIndex = getNextIndex(captureIndex, direction);
                if (newBoard[nextCaptureIndex] === 0 && (!QUAN_BOXES.includes(nextCaptureIndex) || newQuanStones[QUAN_BOXES.indexOf(nextCaptureIndex)] === 0)) {
                    break;
                }
                captureIndex = nextCaptureIndex;
            }

            break;
        }
        // If landed on Quan with only big stone
        else if (QUAN_BOXES.includes(lastIndex) && newBoard[lastIndex] === 0) {
            break;
        }
        // Otherwise break
        else {
            break;
        }
    }

    return { board: newBoard, quanStones: newQuanStones };
}

/**
 * Get winner at end of game
 */
export function getWinner(board, quanStones) {
    // Award remaining stones to their owner ("Chan" rule)
    const finalBoard = [...board];

    // Player X gets remaining stones in their boxes
    let playerXRemaining = 0;
    PLAYER_X_BOXES.forEach(index => {
        playerXRemaining += finalBoard[index];
        finalBoard[index] = 0;
    });
    finalBoard[PLAYER_X_SCORE_INDEX] += playerXRemaining;

    // Player O gets remaining stones in their boxes
    let playerORemaining = 0;
    PLAYER_O_BOXES.forEach(index => {
        playerORemaining += finalBoard[index];
        finalBoard[index] = 0;
    });
    finalBoard[PLAYER_O_SCORE_INDEX] += playerORemaining;

    const scoreX = calculateScore(finalBoard, quanStones, PLAYER_X);
    const scoreO = calculateScore(finalBoard, quanStones, PLAYER_O);

    if (scoreX > scoreO) return PLAYER_X;
    if (scoreO > scoreX) return PLAYER_O;
    return 'draw';
}
