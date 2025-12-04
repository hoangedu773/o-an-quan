/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Game screen component with leaderboard integration
 */

import { useState, useEffect, useCallback } from 'react';
import Scoreboard from '../ui/Scoreboard';
import StatusBar from '../ui/StatusBar';
import MinimaxLog from '../ui/MinimaxLog';
import GameBoard from '../game/GameBoard';
import DirectionChooser from '../game/DirectionChooser';
import Button from '../ui/Button';
import { updatePlayerStats } from '../../utils/leaderboard';
import {
    BOARD_SIZE,
    INITIAL_STONE_SMALL,
    INITIAL_STONE_BIG,
    QUAN_BOXES,
    PLAYER_X,
    PLAYER_O,
    PLAYER_X_BOXES,
    PLAYER_O_BOXES,
    PLAYER_X_SCORE_INDEX,
    PLAYER_O_SCORE_INDEX,
    BIG_STONE_VALUE,
    MINOR_BOX_COUNT,
    SOW_ANIMATION_DELAY,
    AI_MOVE_DELAY,
    HUMAN_TO_AI_DELAY,
    AI_DEPTH,
} from '../../utils/constants';
import {
    getNextIndex,
    checkNeedSow,
    checkEndGame,
    calculateScore,
    getWinner,
} from '../../utils/gameLogic';
import { getBestMove } from '../../utils/minimax';

export default function GameScreen({ gameMode, onBackToMenu, currentPlayer: playerInfo }) {
    // Game state
    const [board, setBoard] = useState([]);
    const [quanStones, setQuanStones] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(PLAYER_X);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isSowing, setIsSowing] = useState(false);
    const [selectedStartIndex, setSelectedStartIndex] = useState(-1);
    const [statusMessage, setStatusMessage] = useState('');
    const [animatingBoxes, setAnimatingBoxes] = useState([]);
    const [logs, setLogs] = useState([]);
    const [isAIThinking, setIsAIThinking] = useState(false);

    // Player labels
    const getPlayerLabels = () => {
        if (gameMode === 'PvA') {
            return { playerX: 'Người', playerO: 'Máy (AI)' };
        } else if (gameMode === 'AvA') {
            return { playerX: 'Máy 1 (AI)', playerO: 'Máy 2 (AI)' };
        }
        return { playerX: 'Dưới', playerO: 'Trên' };
    };

    const { playerX, playerO } = getPlayerLabels();

    // Initialize game
    const initializeGame = useCallback(() => {
        const newBoard = Array(BOARD_SIZE).fill(INITIAL_STONE_SMALL);
        newBoard[PLAYER_X_SCORE_INDEX] = 0;
        newBoard[PLAYER_O_SCORE_INDEX] = 0;

        setBoard(newBoard);
        setQuanStones([INITIAL_STONE_BIG, INITIAL_STONE_BIG]);
        setCurrentPlayer(PLAYER_X);
        setIsGameOver(false);
        setIsSowing(false);
        setSelectedStartIndex(-1);
        setAnimatingBoxes([]);
        setLogs([]);
        setIsAIThinking(false);
        setStatusMessage(`Lượt của Người chơi ${PLAYER_X} (${playerX}). Chọn ô để rải.`);
    }, [playerX]);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    // Calculate scores
    const scoreX = calculateScore(board, quanStones, PLAYER_X);
    const scoreO = calculateScore(board, quanStones, PLAYER_O);

    // Log function
    const addLog = (message, isImportant = false) => {
        setLogs(prev => [...prev, { message, isImportant, timestamp: Date.now() }]);
    };

    // Handle box click
    const handleBoxClick = (index) => {
        if (isGameOver || isSowing || selectedStartIndex !== -1) return;

        const playerBoxes = currentPlayer === PLAYER_X ? PLAYER_X_BOXES : PLAYER_O_BOXES;

        if (!playerBoxes.includes(index)) return;
        if (board[index] === 0) return;

        setSelectedStartIndex(index);
        setStatusMessage(`Đang chờ Người chơi ${currentPlayer} chọn hướng rải quân.`);
    };

    // Handle direction choice
    const handleDirectionChoice = async (direction) => {
        if (selectedStartIndex === -1) return;

        setIsSowing(true);
        setStatusMessage(`Người chơi ${currentPlayer} đang rải quân...`);

        await sowOrScoop(selectedStartIndex, direction);

        setSelectedStartIndex(-1);
        setIsSowing(false);
    };

    // Sow or scoop logic (simplified - needs full implementation)
    const sowOrScoop = async (startIndex, direction) => {
        const newBoard = [...board];
        const newQuanStones = [...quanStones];
        let stonesToSow = newBoard[startIndex];
        newBoard[startIndex] = 0;
        let currentIndex = startIndex;

        const opponentScoreIndex = currentPlayer === PLAYER_X ? PLAYER_O_SCORE_INDEX : PLAYER_X_SCORE_INDEX;

        // Sowing phase
        while (stonesToSow > 0) {
            currentIndex = getNextIndex(currentIndex, direction);

            if (currentIndex === opponentScoreIndex) {
                continue;
            }

            newBoard[currentIndex]++;
            stonesToSow--;

            // Animation
            setAnimatingBoxes([currentIndex]);
            setBoard([...newBoard]);
            await new Promise(resolve => setTimeout(resolve, SOW_ANIMATION_DELAY));
            setAnimatingBoxes([]);
        }

        setBoard(newBoard);

        // Check end game
        if (checkEndGame(newQuanStones)) {
            endGame(newBoard, newQuanStones);
            return;
        }

        // Switch player
        const nextPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
        setCurrentPlayer(nextPlayer);

        const nextLabel = nextPlayer === PLAYER_X ? playerX : playerO;
        setStatusMessage(`Lượt của Người chơi ${nextPlayer} (${nextLabel}).`);

        // Trigger AI if needed
        setTimeout(() => {
            checkAndStartAI(newBoard, newQuanStones, nextPlayer);
        }, HUMAN_TO_AI_DELAY);
    };

    // Check and start AI
    const checkAndStartAI = (currentBoard, currentQuanStones, player) => {
        const shouldAIPlay = (gameMode === 'PvA' && player === PLAYER_O) || gameMode === 'AvA';

        if (!shouldAIPlay || isGameOver) return;

        setIsAIThinking(true);
        setStatusMessage(`AI (${player}) đang tính toán...`);

        setTimeout(() => {
            makeAIMove(currentBoard, currentQuanStones, player);
        }, AI_MOVE_DELAY);
    };

    // Make AI move
    const makeAIMove = (currentBoard, currentQuanStones, player) => {
        const bestMove = getBestMove(currentBoard, currentQuanStones, player, AI_DEPTH, addLog);

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
    const endGame = (finalBoard, finalQuanStones) => {
        setIsGameOver(true);
        setQuanStones(finalQuanStones);

        const winner = getWinner(finalBoard, finalQuanStones);

        // Save result to leaderboard if player is logged in
        if (playerInfo && (gameMode === 'PvP' || gameMode === 'PvA')) {
            if (winner === 'draw') {
                updatePlayerStats('draw');
                setStatusMessage('🤝 TRÒ CHƠI HÒA! Điểm của bạn đã được cập nhật.');
            } else if (winner === PLAYER_X) {
                updatePlayerStats('win');
                setStatusMessage(`🎉 BẠN THẮNG! (+2 điểm). Điểm đã được lưu vào bảng xếp hạng.`);
            } else {
                updatePlayerStats('loss');
                setStatusMessage(`😢 BẠN THUA! Chúc bạn may mắn lần sau.`);
            }
        } else {
            if (winner === 'draw') {
                setStatusMessage('🤝 TRÒ CHƠI HÒA!');
            } else {
                const winnerLabel = winner === PLAYER_X ? playerX : playerO;
                setStatusMessage(`🎉 NGƯỜI CHƠI ${winner} (${winnerLabel}) THẮNG!`);
            }
        }
    };

    return (
        <div>
            <Scoreboard
                scoreX={scoreX}
                scoreO={scoreO}
                playerXLabel={playerX}
                playerOLabel={playerO}
            />

            <StatusBar message={statusMessage} isAI={isAIThinking} />

            {selectedStartIndex !== -1 && !isSowing && (gameMode === 'PvP' || (gameMode === 'PvA' && currentPlayer === PLAYER_X)) && (
                <DirectionChooser
                    boxIndex={selectedStartIndex}
                    onChoose={handleDirectionChoice}
                    onCancel={() => setSelectedStartIndex(-1)}
                />
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
                gameMode={gameMode}
            />

            <div className="text-center mt-6">
                <Button variant="danger" onClick={onBackToMenu}>
                    🔄 CHƠI LẠI / QUAY LẠI MENU
                </Button>
            </div>

            <MinimaxLog logs={logs} isVisible={gameMode !== 'PvP'} />
        </div>
    );
}
