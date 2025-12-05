/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-04
 * Description: Main App component with authentication, match history, and MULTIPLAYER
 */

import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Container from './components/layout/Container';
import MainMenu from './components/screens/MainMenu';
import InstructionsScreen from './components/screens/InstructionsScreen';
import GameScreen from './components/screens/GameScreen';
import LeaderboardScreen from './components/screens/LeaderboardScreen';
import GlobalMatchHistoryScreen from './components/screens/GlobalMatchHistoryScreen';
import LoginScreen from './components/screens/LoginScreen';
import RegisterScreen from './components/screens/RegisterScreen';
import MatchmakingScreen from './components/screens/MatchmakingScreen';
import OnlineGameScreen from './components/screens/OnlineGameScreen';
import { initializeAuthSystem, getCurrentUser as getAuthUser, logout } from './services/mockAuthService';
import { initializeMatchHistory } from './services/mockMatchService';
import { initializeLeaderboard, getCurrentPlayer, setCurrentPlayer, clearCurrentPlayer } from './utils/leaderboard';
import './styles/globals.css';

function App() {
    const [currentScreen, setCurrentScreen] = useState('menu');
    const [gameMode, setGameMode] = useState(null); // 'PvP', 'PvA', 'AvA', 'online'
    const [aiDifficulty, setAiDifficulty] = useState('medium'); // 'easy', 'medium', 'hard'
    const [currentPlayer, setCurrentPlayerState] = useState(null);
    const [authUser, setAuthUser] = useState(null);

    // Multiplayer state
    const [onlineGameData, setOnlineGameData] = useState(null);

    // Initialize systems on mount
    useEffect(() => {
        initializeLeaderboard();
        initializeAuthSystem();
        initializeMatchHistory();

        const player = getCurrentPlayer();
        setCurrentPlayerState(player);

        const user = getAuthUser();
        setAuthUser(user);
    }, []);

    const handleGameModeSelect = (mode, difficulty = 'medium') => {
        setGameMode(mode);
        setAiDifficulty(difficulty);

        // Online multiplayer mode
        if (mode === 'online') {
            if (!authUser && !currentPlayer) {
                setCurrentScreen('login');
            } else {
                setCurrentScreen('matchmaking');
            }
            return;
        }

        // Check if user is logged in for PvP/PvA modes
        if ((mode === 'PvP' || mode === 'PvA') && !authUser) {
            setCurrentScreen('login');
            return;
        }

        setCurrentScreen('game');
    };

    const handleLoginSuccess = (user) => {
        setAuthUser(user);
        const player = setCurrentPlayer(user.playerName);
        setCurrentPlayerState(player);

        if (gameMode === 'online') {
            setCurrentScreen('matchmaking');
        } else if (gameMode) {
            setCurrentScreen('game');
        } else {
            setCurrentScreen('menu');
        }
    };

    const handleRegisterSuccess = (user) => {
        setAuthUser(user);
        const player = setCurrentPlayer(user.playerName);
        setCurrentPlayerState(player);
        setCurrentScreen('menu');
    };

    const handleLogout = () => {
        logout();
        setAuthUser(null);
        clearCurrentPlayer();
        setCurrentPlayerState(null);
        setCurrentScreen('menu');
    };

    const handleGuestPlay = () => {
        const guestPlayer = setCurrentPlayer('Người chơi ẩn danh');
        setCurrentPlayerState(guestPlayer);
        setAuthUser(null);

        if (gameMode === 'online') {
            setCurrentScreen('matchmaking');
        } else if (gameMode) {
            setCurrentScreen('game');
        } else {
            setCurrentScreen('menu');
        }
    };

    const handleMatchFound = (matchData) => {
        setOnlineGameData(matchData);
        setCurrentScreen('game');
    };

    const handleCancelMatchmaking = () => {
        setGameMode(null);
        setCurrentScreen('menu');
    };

    const handleShowInstructions = () => setCurrentScreen('instructions');
    const handleShowLeaderboard = () => setCurrentScreen('leaderboard');
    const handleShowMatchHistory = () => setCurrentScreen('matchHistory');

    const handleBackToMenu = () => {
        setCurrentScreen('menu');
        setGameMode(null);
        setOnlineGameData(null);
    };

    const handleSwitchToRegister = () => setCurrentScreen('register');
    const handleSwitchToLogin = () => setCurrentScreen('login');

    return (
        <div className="min-h-screen">
            <Container>
                <Header />

                {authUser && currentScreen === 'menu' && (
                    <div className="glass-dark p-3 rounded-xl mb-6 max-w-md mx-auto text-center">
                        <p className="text-sm text-gray-300">
                            👤 Đang chơi với: <span className="font-bold text-accent">{authUser.playerName}</span>
                        </p>
                        <button onClick={handleLogout} className="text-xs text-red-300 hover:text-red-200 underline mt-1">
                            Đăng xuất
                        </button>
                    </div>
                )}

                {currentScreen === 'menu' && (
                    <MainMenu
                        onGameModeSelect={handleGameModeSelect}
                        onShowInstructions={handleShowInstructions}
                        onShowLeaderboard={handleShowLeaderboard}
                        onShowMatchHistory={handleShowMatchHistory}
                    />
                )}

                {currentScreen === 'instructions' && <InstructionsScreen onBack={handleBackToMenu} />}
                {currentScreen === 'leaderboard' && <LeaderboardScreen onBack={handleBackToMenu} />}
                {currentScreen === 'matchHistory' && <GlobalMatchHistoryScreen onBack={handleBackToMenu} />}

                {currentScreen === 'login' && (
                    <LoginScreen
                        onLoginSuccess={handleLoginSuccess}
                        onSwitchToRegister={handleSwitchToRegister}
                        onSkip={handleGuestPlay}
                    />
                )}

                {currentScreen === 'register' && (
                    <RegisterScreen
                        onRegisterSuccess={handleRegisterSuccess}
                        onSwitchToLogin={handleSwitchToLogin}
                    />
                )}

                {currentScreen === 'matchmaking' && (
                    <MatchmakingScreen
                        playerName={authUser?.playerName || currentPlayer?.name || 'Người chơi ẩn danh'}
                        onMatchFound={handleMatchFound}
                        onCancel={handleCancelMatchmaking}
                    />
                )}

                {currentScreen === 'game' && gameMode && gameMode !== 'online' && (
                    <GameScreen
                        gameMode={gameMode}
                        aiDifficulty={aiDifficulty}
                        onBackToMenu={handleBackToMenu}
                        currentPlayer={currentPlayer}
                    />
                )}

                {currentScreen === 'game' && gameMode === 'online' && onlineGameData && (
                    <OnlineGameScreen
                        onlineGameData={onlineGameData}
                        onBackToMenu={handleBackToMenu}
                        currentPlayer={currentPlayer}
                    />
                )}
            </Container>

            <footer className="text-center text-gray-300 text-sm py-6 mt-12">
                <p>Made with ❤️ by <strong>hoangedu773</strong></p>
                <p className="mt-1">
                    <a href="https://github.com/hoangedu773" target="_blank" rel="noopener noreferrer"
                        className="text-accent hover:text-yellow-300 transition-colors">
                        GitHub: @hoangedu773
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default App;
