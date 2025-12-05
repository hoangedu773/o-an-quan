/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-05
 * Description: Quan box component - displays stones (no big stone)
 */

import StoneDisplay from './StoneDisplay';

export default function QuanBox({ player, stones, quanStone, index, hasHand = false }) {
    const playerName = player === 'X' ? 'X' : 'O';

    // Total value = small stones + big stone (10 points)
    const totalValue = stones + (quanStone * 10);

    return (
        <div className={`relative glass-quan flex flex-col justify-center items-center w-24 h-80 md:w-28 md:h-96 rounded-xl p-3 flex-shrink-0
            ${hasHand ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>

            {/* Hand cursor animation */}
            {hasHand && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce z-20">
                    ✋
                </div>
            )}

            <p className="font-bold text-lg mb-2 text-white text-glow">Ô Quan</p>

            {/* Stone display */}
            <div className="flex-1 flex flex-col justify-center items-center">
                {quanStone > 0 ? (
                    // Display 1 big stone when quanStone=1
                    <div className="text-6xl animate-float">💎</div>
                ) : (
                    // Display small stones when big stone is gone
                    <StoneDisplay count={stones} maxDisplay={20} />
                )}
            </div>

            {/* Stone count - shows total value */}
            <p className="text-4xl font-black text-white text-glow-accent mt-2">{totalValue}</p>
            <p className="text-xs text-gray-200">viên sỏi</p>
        </div>
    );
}
