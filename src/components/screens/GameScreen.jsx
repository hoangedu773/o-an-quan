/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-05
 * Description: Game screen - OFFICIAL RULES IMPLEMENTATION
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import Scoreboard from '../ui/Scoreboard';
import StatusBar from '../ui/StatusBar';
import GameBoard from '../game/GameBoard';
import DirectionChooser from '../game/DirectionChooser';
import Button from '../ui/Button';
import { updatePlayerStats } from '../../utils/leaderboard';
import {
    BOARD_SIZE,
    INITIAL_STONE_SMALL,
    INITIAL_STONE_BIG,
    BIG_STONE_VALUE,
    PLAYER_X,
    PLAYER_O,
    PLAYER_X_BOXES,
    PLAYER_O_BOXES,
    QUAN_O_INDEX,
    QUAN_X_INDEX,
    QUAN_BOXES,
    SOW_ANIMATION_DELAY,
    AI_MOVE_DELAY,
    HUMAN_TO_AI_DELAY,
} from '../../utils/constants';
import { getNextIndex } from '../../utils/gameLogic';
import { getBestMove } from '../../utils/minimax';

const CAPTURE_ANIMATION_DELAY = 400;
const REDISTRIBUTION_COST = 5;

const getAIDepth = (difficulty) => {
    switch (difficulty) {
        case 'easy': return 2;
        case 'medium': return 4;
        case 'hard': return 6;
        default: return 4;
    }
};

export default function GameScreen({ gameMode, aiDifficulty = 'medium', onBackToMenu, currentPlayer: playerInfo }) {
    // Game state
    const [board, setBoard] = useState([]);
    const [quanStones, setQuanStones] = useState([1, 1]); // [Quan O, Quan X]
    const [scores, setScores] = useState({ X: 0, O: 0 });
    const [currentPlayer, setCurrentPlayer] = useState(PLAYER_X);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isSowing, setIsSowing] = useState(false);
    const [selectedStartIndex, setSelectedStartIndex] = useState(-1);
    const [statusMessage, setStatusMessage] = useState('');
    const [animatingBoxes, setAnimatingBoxes] = useState([]);
    const [capturingBox, setCapturingBox] = useState(-1);
    const [handPosition, setHandPosition] = useState(-1);
    const [isAIThinking, setIsAIThinking] = useState(false);

    const gameOverRef = useRef(false);
    const aiDepth = getAIDepth(aiDifficulty);

    // Player labels
    const getPlayerLabels = () => {
        if (gameMode === 'PvA') {
            const difficultyLabel = {
                easy: 'AI Dễ 😊',
                medium: 'AI Trung bình 🧐',
                hard: 'AI Khó 💀'
            }[aiDifficulty] || 'AI';
            return { playerX: 'Bạn', playerO: difficultyLabel };
        } else if (gameMode === 'AvA') {
            return { playerX: 'AI 1', playerO: 'AI 2' };
        }
        return { playerX: 'Người chơi 1', playerO: 'Người chơi 2' };
    };

    const { playerX, playerO } = getPlayerLabels();

    // Initialize game
    const initializeGame = useCallback(() => {
        const newBoard = Array(BOARD_SIZE).fill(INITIAL_STONE_SMALL);
        newBoard[QUAN_O_INDEX] = 0; // Quan boxes start with 0 small stones
        newBoard[QUAN_X_INDEX] = 0;

        setBoard(newBoard);
        setQuanStones([INITIAL_STONE_BIG, INITIAL_STONE_BIG]); // Both Quan start with big stones
        setScores({ X: 0, O: 0 });
        setCurrentPlayer(PLAYER_X);
        setIsGameOver(false);
        gameOverRef.current = false;
        setIsSowing(false);
        setSelectedStartIndex(-1);
        setAnimatingBoxes([]);
        setCapturingBox(-1);
        setHandPosition(-1);
        setIsAIThinking(false);

        if (gameMode === 'PvA') {
            setStatusMessage(`Lượt của bạn! Chọn ô để rải.`);
        } else if (gameMode === 'AvA') {
            setStatusMessage('AI đang chuẩn bị...');
        } else {
            setStatusMessage(`Lượt của ${playerX}. Chọn ô để rải.`);
        }
    }, [playerX, gameMode, aiDifficulty]);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    // Trigger AI when it's AI's turn
    useEffect(() => {
        if (isGameOver || isSowing || isAIThinking) return;

        const shouldAIPlay = (gameMode === 'PvA' && currentPlayer === PLAYER_O) || gameMode === 'AvA';

        if (shouldAIPlay && board.length > 0) {
            setTimeout(() => {
                triggerAI();
            }, HUMAN_TO_AI_DELAY);
        }
    }, [currentPlayer, gameMode, isGameOver, isSowing, isAIThinking, board.length]);

    // Check if need redistribution - AUTO once if score >= 5
    const checkAndRedistribute = () => {
        const playerBoxes = currentPlayer === PLAYER_X ? PLAYER_X_BOXES : PLAYER_O_BOXES;
        const total = playerBoxes.reduce((sum, i) => sum + board[i], 0);

        if (total === 0) {
            // Check if player has enough points to redistribute
            if (scores[currentPlayer] >= REDISTRIBUTION_COST) {
                const newBoard = [...board];
                const newScores = { ...scores };

                // Redistribute ONCE
                playerBoxes.forEach(i => newBoard[i] = 1);
                newScores[currentPlayer] -= REDISTRIBUTION_COST;

                setBoard(newBoard);
                setScores(newScores);
                setStatusMessage(`🔄 Hết quân! Tự động rải 5 dân (-5 điểm)`);
                return true;
            } else {
                // Not enough points - GAME OVER (player loses)
                setStatusMessage(`❌ Hết quân và không đủ ${REDISTRIBUTION_COST} điểm! Bạn thua!`);
                endGame(board, scores); // End game immediately
                return false;
            }
        }
        return false;
    };

    // Handle box click
    const handleBoxClick = (index) => {
        if (isGameOver || isSowing || selectedStartIndex !== -1 || isAIThinking) return;

        const playerBoxes = currentPlayer === PLAYER_X ? PLAYER_X_BOXES : PLAYER_O_BOXES;

        if (!playerBoxes.includes(index)) return;
        if (board[index] === 0) return;
        if (gameMode === 'PvA' && currentPlayer !== PLAYER_X) return;

        // Check redistribution before allowing move
        if (checkAndRedistribute()) {
            setTimeout(() => {
                setStatusMessage(`Chọn ô để rải.`);
            }, 2000);
            return;
        }

        setHandPosition(-1);
        setSelectedStartIndex(index);
        setStatusMessage(`Chọn hướng rải từ ô ${index}.`);
    };

    // Handle direction choice
    const handleDirectionChoice = async (direction) => {
        if (selectedStartIndex === -1) return;

        setIsSowing(true);
        setStatusMessage(`✋ Đang rải quân...`);

        await performMove(selectedStartIndex, direction, currentPlayer);

        setSelectedStartIndex(-1);
        setIsSowing(false);
    };

    // Perform a complete move - OFFICIAL RULES
    const performMove = async (startIndex, direction, player) => {
        let newBoard = [...board];
        let newScores = { ...scores };
        let newQuanStones = [...quanStones];
        let stonesToSow = newBoard[startIndex];
        newBoard[startIndex] = 0;
        let currentIndex = startIndex;

        setHandPosition(startIndex);
        setBoard([...newBoard]);
        await new Promise(resolve => setTimeout(resolve, 300));

        // PHASE 1: Sow ALL stones (into ALL boxes including Quan)
        while (stonesToSow > 0) {
            currentIndex = getNextIndex(currentIndex, direction);
            newBoard[currentIndex]++;
            stonesToSow--;

            setStatusMessage(`✋ Rải vào ô ${currentIndex}... (còn ${stonesToSow} đá)`);
            setHandPosition(currentIndex);
            setAnimatingBoxes([currentIndex]);
            setBoard([...newBoard]);
            await new Promise(resolve => setTimeout(resolve, SOW_ANIMATION_DELAY));
            setAnimatingBoxes([]);
        }

        // PHASE 2: Check next box after sowing
        let continueLoop = true;
        while (continueLoop) {
            let nextIndex = getNextIndex(currentIndex, direction);

            // RULE 1: If next is Quan → STOP (turn ends)
            const isNextQuan = nextIndex === QUAN_O_INDEX || nextIndex === QUAN_X_INDEX;
            if (isNextQuan) {
                setStatusMessage(`🛑 Dừng tại Ô Quan`);
                await new Promise(resolve => setTimeout(resolve, 500));
                continueLoop = false;
                break;
            }

            // RULE 2: If next has stones → Pick up and continue sowing
            if (newBoard[nextIndex] > 0) {
                stonesToSow = newBoard[nextIndex];
                newBoard[nextIndex] = 0;
                currentIndex = nextIndex;

                setHandPosition(nextIndex);
                setStatusMessage(`✋ Bốc ${stonesToSow} đá từ ô ${nextIndex}...`);
                setAnimatingBoxes([nextIndex]);
                setBoard([...newBoard]);
                await new Promise(resolve => setTimeout(resolve, SOW_ANIMATION_DELAY));
                setAnimatingBoxes([]);

                // Continue sowing these stones
                while (stonesToSow > 0) {
                    currentIndex = getNextIndex(currentIndex, direction);
                    newBoard[currentIndex]++;
                    stonesToSow--;

                    setStatusMessage(`✋ Rải vào ô ${currentIndex}... (còn ${stonesToSow} đá)`);
                    setHandPosition(currentIndex);
                    setAnimatingBoxes([currentIndex]);
                    setBoard([...newBoard]);
                    await new Promise(resolve => setTimeout(resolve, SOW_ANIMATION_DELAY));
                    setAnimatingBoxes([]);
                }
                continue; // Loop back to check next box again
            }

            // RULE 3: If next is empty → Check for capture
            if (newBoard[nextIndex] === 0) {
                let captureIndex = getNextIndex(nextIndex, direction);

                // Capture loop - capture ANY box with stones (including Quan)
                while (true) {
                    let hasStones = newBoard[captureIndex] > 0;
                    let hasQuanStone = QUAN_BOXES.includes(captureIndex) &&
                        newQuanStones[captureIndex === QUAN_O_INDEX ? 0 : 1] > 0;

                    if (!hasStones && !hasQuanStone) break;

                    let captureStones = newBoard[captureIndex];

                    // Add big stone value if capturing Quan (regardless of whose "side")
                    if (captureIndex === QUAN_O_INDEX && newQuanStones[0] > 0) {
                        captureStones += BIG_STONE_VALUE;
                        newQuanStones[0] = 0;
                    } else if (captureIndex === QUAN_X_INDEX && newQuanStones[1] > 0) {
                        captureStones += BIG_STONE_VALUE;
                        newQuanStones[1] = 0;
                    }

                    if (captureStones === 0) break;

                    setStatusMessage(`🎯 ĂN ${captureStones} đá từ ô ${captureIndex}!`);
                    setHandPosition(captureIndex);
                    setCapturingBox(captureIndex);
                    await new Promise(resolve => setTimeout(resolve, CAPTURE_ANIMATION_DELAY));

                    newScores[player] += captureStones;
                    newBoard[captureIndex] = 0;

                    setScores({ ...newScores });
                    setQuanStones([...newQuanStones]);
                    setBoard([...newBoard]);
                    await new Promise(resolve => setTimeout(resolve, CAPTURE_ANIMATION_DELAY));
                    setCapturingBox(-1);

                    // Check for continuous capture
                    let nextEmptyCheck = getNextIndex(captureIndex, direction);
                    if (newBoard[nextEmptyCheck] > 0) break; // Not empty, stop

                    let nextCaptureCheck = getNextIndex(nextEmptyCheck, direction);
                    let nextHasStones = newBoard[nextCaptureCheck] > 0;
                    let nextHasQuan = QUAN_BOXES.includes(nextCaptureCheck) &&
                        newQuanStones[nextCaptureCheck === QUAN_O_INDEX ? 0 : 1] > 0;

                    if (nextHasStones || nextHasQuan) {
                        captureIndex = nextCaptureCheck;
                    } else {
                        break;
                    }
                }
            }

            continueLoop = false;
        }

        // Update final state
        setBoard(newBoard);
        setScores(newScores);
        setQuanStones(newQuanStones);

        // Check end game: BOTH Quan boxes empty (no big stones)
        const bothQuanEmpty = newQuanStones[0] === 0 && newQuanStones[1] === 0;
        if (bothQuanEmpty) {
            endGame(newBoard, newScores);
            return;
        }

        // Switch player
        const nextPlayer = player === PLAYER_X ? PLAYER_O : PLAYER_X;
        setCurrentPlayer(nextPlayer);

        // Update status
        if (gameMode === 'PvA') {
            if (nextPlayer === PLAYER_X) {
                setStatusMessage(`Lượt của bạn! Chọn ô để rải.`);
            } else {
                setStatusMessage(`🤖 AI đang suy nghĩ...`);
            }
        } else if (gameMode === 'AvA') {
            const nextLabel = nextPlayer === PLAYER_X ? 'AI 1' : 'AI 2';
            setStatusMessage(`${nextLabel} đang suy nghĩ...`);
        } else {
            const nextLabel = nextPlayer === PLAYER_X ? playerX : playerO;
            setStatusMessage(`Lượt của ${nextLabel}. Chọn ô để rải.`);
        }
    };

    // Trigger AI
    const triggerAI = () => {
        if (gameOverRef.current || isSowing || isAIThinking) return;

        const shouldAIPlay = (gameMode === 'PvA' && currentPlayer === PLAYER_O) || gameMode === 'AvA';
        if (!shouldAIPlay) return;

        // Check redistribution for AI
        if (checkAndRedistribute()) {
            setTimeout(() => {
                triggerAI();
            }, 2000);
            return;
        }

        setIsAIThinking(true);

        setTimeout(() => {
            makeAIMove();
        }, AI_MOVE_DELAY);
    };

    // Make AI move
    const makeAIMove = () => {
        if (gameOverRef.current) {
            setIsAIThinking(false);
            return;
        }

        const tempBoard = [...board];
        const tempQuanStones = [...quanStones];

        const bestMove = getBestMove(tempBoard, tempQuanStones, currentPlayer, aiDepth);

        if (!bestMove) {
            setIsAIThinking(false);
            return;
        }

        setSelectedStartIndex(bestMove.boxIndex);
        setIsAIThinking(false);

        setTimeout(() => {
            handleDirectionChoice(bestMove.direction);
        }, 500);
    };

    // End game
    const endGame = (finalBoard, finalScores) => {
        setIsGameOver(true);
        gameOverRef.current = true;
        setHandPosition(-1);

        let xRemaining = 0;
        let oRemaining = 0;

        PLAYER_X_BOXES.forEach(i => { xRemaining += finalBoard[i]; });
        PLAYER_O_BOXES.forEach(i => { oRemaining += finalBoard[i]; });

        const finalScoreX = finalScores.X + xRemaining;
        const finalScoreO = finalScores.O + oRemaining;

        setScores({ X: finalScoreX, O: finalScoreO });

        let winner;
        if (finalScoreX > finalScoreO) {
            winner = PLAYER_X;
        } else if (finalScoreO > finalScoreX) {
            winner = PLAYER_O;
        } else {
            winner = 'draw';
        }

        if (playerInfo && (gameMode === 'PvP' || gameMode === 'PvA')) {
            if (winner === 'draw') {
                updatePlayerStats('draw');
                setStatusMessage(`🤝 HÒA! (${finalScoreX} - ${finalScoreO})`);
            } else if (winner === PLAYER_X) {
                updatePlayerStats('win');
                setStatusMessage(`🎉 BẠN THẮNG! (${finalScoreX} - ${finalScoreO})`);
            } else {
                updatePlayerStats('loss');
                setStatusMessage(`😢 BẠN THUA! (${finalScoreX} - ${finalScoreO})`);
            }
        } else {
            if (winner === 'draw') {
                setStatusMessage(`🤝 HÒA! (${finalScoreX} - ${finalScoreO})`);
            } else {
                const winnerLabel = winner === PLAYER_X ? playerX : playerO;
                setStatusMessage(`🎉 ${winnerLabel} THẮNG! (${finalScoreX} - ${finalScoreO})`);
            }
        }
    };

    return (
        <div>
            <Scoreboard
                scoreX={scores.X}
                scoreO={scores.O}
                playerXLabel={playerX}
                playerOLabel={playerO}
            />

            <StatusBar message={statusMessage} isAI={isAIThinking} />

            {selectedStartIndex !== -1 && !isSowing && !isAIThinking && (
                (gameMode === 'PvP' || (gameMode === 'PvA' && currentPlayer === PLAYER_X)) && (
                    <DirectionChooser
                        boxIndex={selectedStartIndex}
                        onChoose={handleDirectionChoice}
                        onCancel={() => setSelectedStartIndex(-1)}
                    />
                )
            )}

            <GameBoard
                board={board}
                quanStones={quanStones}
                currentPlayer={currentPlayer}
                onBoxClick={handleBoxClick}
                isGameOver={isGameOver}
                isSowing={isSowing}
                selectedStartIndex={selectedStartIndex}
                animatingBoxes={animatingBoxes}
                capturingBox={capturingBox}
                handPosition={handPosition}
                gameMode={gameMode}
            />

            <div className="text-center mt-6">
                <Button variant="danger" onClick={onBackToMenu}>
                    🔄 CHƠI LẠI / QUAY LẠI
                </Button>
            </div>
        </div>
    );
}
