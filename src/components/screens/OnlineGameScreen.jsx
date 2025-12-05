/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Online multiplayer game screen with real-time sync
 */

import { useState, useEffect, useCallback } from 'react';
import Scoreboard from '../ui/Scoreboard';
import StatusBar from '../ui/StatusBar';
import GameBoard from '../game/GameBoard';
import DirectionChooser from '../game/DirectionChooser';
import Button from '../ui/Button';
import {
    BOARD_SIZE,
    INITIAL_STONE_SMALL,
    INITIAL_STONE_BIG,
    BIG_STONE_VALUE,
    PLAYER_X,
    PLAYER_O,
    PLAYER_X_BOXES,
    PLAYER_O_BOXES,
    PLAYER_X_SCORE_INDEX,
    PLAYER_O_SCORE_INDEX,
    QUAN_O_INDEX,
    QUAN_X_INDEX,
    QUAN_BOXES,
    SOW_ANIMATION_DELAY,
} from '../../utils/constants';
import {
    getNextIndex,
    checkEndGame,
    calculateScore,
    getWinner,
} from '../../utils/gameLogic';
import {
    makeMove,
    syncGameState,
    endGame,
    onOpponentMove,
    onTurnChanged,
    onStateSynced,
    onGameOver,
    onOpponentDisconnected,
} from '../../services/socketService';

export default function OnlineGameScreen({ onlineGameData, onBackToMenu, currentPlayer: playerInfo }) {
    const { gameId, opponent, yourSide, isYourTurn: initialTurn } = onlineGameData;

    // Game state
    const [board, setBoard] = useState([]);
    const [quanStones, setQuanStones] = useState([INITIAL_STONE_BIG, INITIAL_STONE_BIG]);
    const [isMyTurn, setIsMyTurn] = useState(initialTurn);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isSowing, setIsSowing] = useState(false);
    const [selectedStartIndex, setSelectedStartIndex] = useState(-1);
    const [statusMessage, setStatusMessage] = useState('');
    const [animatingBoxes, setAnimatingBoxes] = useState([]);
    const [winner, setWinner] = useState(null);
    const [disconnected, setDisconnected] = useState(false);

    // My boxes based on side
    const myBoxes = yourSide === 'bottom' ? PLAYER_X_BOXES : PLAYER_O_BOXES;
    const myScoreIndex = yourSide === 'bottom' ? PLAYER_X_SCORE_INDEX : PLAYER_O_SCORE_INDEX;
    const opponentScoreIndex = yourSide === 'bottom' ? PLAYER_O_SCORE_INDEX : PLAYER_X_SCORE_INDEX;

    // Initialize game
    useEffect(() => {
        const newBoard = Array(BOARD_SIZE).fill(INITIAL_STONE_SMALL);
        newBoard[PLAYER_X_SCORE_INDEX] = 0;
        newBoard[PLAYER_O_SCORE_INDEX] = 0;
        setBoard(newBoard);

        updateStatus();
    }, []);

    // Update status message
    const updateStatus = useCallback(() => {
        if (isGameOver) {
            setStatusMessage(winner ? `🎉 ${winner} thắng!` : '🤝 Hòa!');
        } else if (disconnected) {
            setStatusMessage('❌ Đối thủ đã thoát game!');
        } else if (isMyTurn) {
            setStatusMessage('🎮 Lượt của BẠN! Chọn ô để rải quân.');
        } else {
            setStatusMessage(`⏳ Đợi ${opponent.name} đi...`);
        }
    }, [isMyTurn, isGameOver, winner, disconnected, opponent.name]);

    useEffect(() => {
        updateStatus();
    }, [updateStatus]);

    // Socket event listeners
    useEffect(() => {
        const unsubOpponentMove = onOpponentMove(async ({ pitIndex, direction }) => {
            console.log('Opponent moved:', pitIndex, direction);
            await executeSow(pitIndex, direction, false);
        });

        const unsubTurnChanged = onTurnChanged(({ currentTurn }) => {
            // currentTurn contains the socket ID of whose turn it is
            // We need to check if it matches our socket
        });

        const unsubStateSynced = onStateSynced(({ board: newBoard, scores }) => {
            setBoard(newBoard);
        });

        const unsubGameOver = onGameOver(({ winner: w, scores }) => {
            setIsGameOver(true);
            setWinner(w);
        });

        const unsubDisconnect = onOpponentDisconnected(() => {
            setDisconnected(true);
            setStatusMessage('❌ Đối thủ đã thoát game!');
        });

        return () => {
            unsubOpponentMove();
            unsubTurnChanged();
            unsubStateSynced();
            unsubGameOver();
            unsubDisconnect();
        };
    }, []);

    // Calculate scores
    const myScore = calculateScore(board, quanStones, yourSide === 'bottom' ? PLAYER_X : PLAYER_O);
    const opponentScore = calculateScore(board, quanStones, yourSide === 'bottom' ? PLAYER_O : PLAYER_X);

    // Handle box click
    const handleBoxClick = (index) => {
        if (!isMyTurn || isGameOver || isSowing || selectedStartIndex !== -1) return;
        if (!myBoxes.includes(index)) return;
        if (board[index] === 0) return;

        setSelectedStartIndex(index);
        setStatusMessage('Chọn hướng rải quân...');
    };

    // Handle direction choice
    const handleDirectionChoice = async (direction) => {
        if (selectedStartIndex === -1) return;

        // Send move to server
        makeMove(gameId, selectedStartIndex, direction);

        // Execute locally
        await executeSow(selectedStartIndex, direction, true);

        setSelectedStartIndex(-1);
    };

    // Execute sowing - OFFICIAL RULES
    const executeSow = async (startIndex, direction, isMyMove) => {
        setIsSowing(true);

        const newBoard = [...board];
        const newQuanStones = [...quanStones];
        let stonesToSow = newBoard[startIndex];
        newBoard[startIndex] = 0;
        let currentIndex = startIndex;

        // PHASE 1: Sow ALL stones (into ALL boxes including Quan)
        while (stonesToSow > 0) {
            currentIndex = getNextIndex(currentIndex, direction);
            newBoard[currentIndex]++;
            stonesToSow--;

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
                continueLoop = false;
                break;
            }

            // RULE 2: If next has stones → Pick up and continue sowing
            if (newBoard[nextIndex] > 0) {
                stonesToSow = newBoard[nextIndex];
                newBoard[nextIndex] = 0;
                currentIndex = nextIndex;

                setAnimatingBoxes([nextIndex]);
                setBoard([...newBoard]);
                await new Promise(resolve => setTimeout(resolve, SOW_ANIMATION_DELAY));
                setAnimatingBoxes([]);

                // Continue sowing these stones
                while (stonesToSow > 0) {
                    currentIndex = getNextIndex(currentIndex, direction);
                    newBoard[currentIndex]++;
                    stonesToSow--;

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

                    // Add big stone value if capturing Quan
                    if (captureIndex === QUAN_O_INDEX && newQuanStones[0] > 0) {
                        captureStones += BIG_STONE_VALUE;
                        newQuanStones[0] = 0;
                    } else if (captureIndex === QUAN_X_INDEX && newQuanStones[1] > 0) {
                        captureStones += BIG_STONE_VALUE;
                        newQuanStones[1] = 0;
                    }

                    if (captureStones === 0) break;

                    // Add to my score
                    newBoard[isMyMove ? myScoreIndex : opponentScoreIndex] += captureStones;
                    newBoard[captureIndex] = 0;

                    setBoard([...newBoard]);
                    await new Promise(resolve => setTimeout(resolve, SOW_ANIMATION_DELAY));

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

        setBoard(newBoard);
        setQuanStones(newQuanStones);

        // Sync state if my move
        if (isMyMove) {
            syncGameState(gameId, newBoard, {
                player1: newBoard[PLAYER_X_SCORE_INDEX],
                player2: newBoard[PLAYER_O_SCORE_INDEX]
            });
            setIsMyTurn(false);
        } else {
            setIsMyTurn(true);
        }

        // Check end game - need quanStones, not board
        if (checkEndGame(quanStones)) {
            setIsGameOver(true);
            const scores = {
                X: newBoard[PLAYER_X_SCORE_INDEX],
                O: newBoard[PLAYER_O_SCORE_INDEX]
            };
            const w = getWinner(scores);
            setWinner(w === 'draw' ? null : (w === PLAYER_X ? (yourSide === 'bottom' ? 'Bạn' : opponent.name) : (yourSide === 'top' ? 'Bạn' : opponent.name)));

            if (isMyMove) {
                endGame(gameId, w, scores);
            }
        }

        setIsSowing(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Online badge */}
            <div className="text-center mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 bg-opacity-20 border border-green-400 rounded-full text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    🌐 Online Match
                </span>
            </div>

            {/* Opponent info */}
            <div className="glass-dark p-3 rounded-xl mb-4 text-center">
                <p className="text-gray-300 text-sm">
                    Đối thủ: <span className="font-bold text-red-400">{opponent.name}</span>
                </p>
            </div>

            {/* Scoreboard */}
            <Scoreboard
                scoreX={yourSide === 'bottom' ? myScore : opponentScore}
                scoreO={yourSide === 'bottom' ? opponentScore : myScore}
                currentPlayer={isMyTurn ? (yourSide === 'bottom' ? PLAYER_X : PLAYER_O) : (yourSide === 'bottom' ? PLAYER_O : PLAYER_X)}
                playerXLabel={yourSide === 'bottom' ? `Bạn (${playerInfo?.name || 'Bạn'})` : opponent.name}
                playerOLabel={yourSide === 'bottom' ? opponent.name : `Bạn (${playerInfo?.name || 'Bạn'})`}
            />

            {/* Status Bar */}
            <StatusBar message={statusMessage} />

            {/* Game Board */}
            <GameBoard
                board={board}
                quanStones={quanStones}
                onBoxClick={handleBoxClick}
                selectedBox={selectedStartIndex}
                currentPlayer={isMyTurn ? (yourSide === 'bottom' ? PLAYER_X : PLAYER_O) : null}
                animatingBoxes={animatingBoxes}
                disabled={!isMyTurn || isGameOver || isSowing}
            />

            {/* Direction Chooser */}
            {selectedStartIndex !== -1 && (
                <DirectionChooser
                    onChoice={handleDirectionChoice}
                    onCancel={() => setSelectedStartIndex(-1)}
                />
            )}

            {/* Game Over */}
            {(isGameOver || disconnected) && (
                <div className="glass p-6 rounded-xl text-center mt-6">
                    <h3 className="text-2xl font-bold mb-4">
                        {disconnected ? '❌ Đối thủ đã thoát!' : (winner === 'Bạn' ? '🎉 Bạn THẮNG!' : `😢 ${winner} thắng!`)}
                    </h3>
                    <div className="text-lg mb-4">
                        <p>Điểm của bạn: <span className="font-bold text-accent">{myScore}</span></p>
                        <p>Điểm đối thủ: <span className="font-bold">{opponentScore}</span></p>
                    </div>
                    <Button variant="primary" onClick={onBackToMenu}>
                        🔙 Về Menu Chính
                    </Button>
                </div>
            )}

            {/* Back button */}
            {!isGameOver && !disconnected && (
                <div className="mt-6 text-center">
                    <Button variant="secondary" onClick={onBackToMenu}>
                        🔙 Thoát (Thua cuộc)
                    </Button>
                </div>
            )}
        </div>
    );
}
