/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Main game board component
 */

import { PLAYER_X_BOXES, PLAYER_O_BOXES } from '../../utils/constants';
import QuanBox from './QuanBox';
import DanBox from './DanBox';

export default function GameBoard({
    board,
    quanStones,
    currentPlayer,
    onBoxClick,
    isGameOver,
    isSowing,
    selectedStartIndex,
    animatingBoxes,
    gameMode
}) {
    const isBoxActive = (index) => {
        if (isGameOver || isSowing || selectedStartIndex !== -1) return false;

        const playerBoxes = currentPlayer === 'X' ? PLAYER_X_BOXES : PLAYER_O_BOXES;

        // For PvP: both players can click their boxes
        // For PvA: only X (human) can click
        const isHumanTurn = gameMode === 'PvP' || (gameMode === 'PvA' && currentPlayer === 'X');

        return playerBoxes.includes(index) && board[index] > 0 && isHumanTurn;
    };

    const getPlayerForBox = (index) => {
        if (PLAYER_X_BOXES.includes(index)) return 'X';
        if (PLAYER_O_BOXES.includes(index)) return 'O';
        return null;
    };

    return (
        <div className="glass border-4 border-gray-900 border-opacity-50 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
            {/* Quan O (Left) */}
            <QuanBox
                player="O"
                stones={board[0]}
                quanStone={quanStones[0]}
                index={0}
            />

            {/* Dan Boxes Container */}
            <div className="flex flex-col flex-grow gap-2">
                {/* Row O (Top) - Indices 5 to 1 */}
                <div className="flex justify-around gap-1">
                    {[5, 4, 3, 2, 1].map(index => (
                        <DanBox
                            key={index}
                            index={index}
                            stones={board[index]}
                            isActive={isBoxActive(index)}
                            onClick={() => onBoxClick(index)}
                            player={getPlayerForBox(index)}
                            isAnimating={animatingBoxes.includes(index)}
                        />
                    ))}
                </div>

                {/* Row X (Bottom) - Indices 7 to 11 */}
                <div className="flex justify-around gap-1">
                    {[7, 8, 9, 10, 11].map(index => (
                        <DanBox
                            key={index}
                            index={index}
                            stones={board[index]}
                            isActive={isBoxActive(index)}
                            onClick={() => onBoxClick(index)}
                            player={getPlayerForBox(index)}
                            isAnimating={animatingBoxes.includes(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Quan X (Right) */}
            <QuanBox
                player="X"
                stones={board[6]}
                quanStone={quanStones[1]}
                index={6}
            />
        </div>
    );
}
