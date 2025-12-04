/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Quan box component (large box at ends)
 */

import StoneDisplay from './StoneDisplay';

export default function QuanBox({ player, stones, quanStone, index }) {
    const playerName = player === 'X' ? 'X' : 'O';

    return (
        <div className="glass-quan flex flex-col justify-center items-center w-24 h-80 md:w-28 md:h-96 rounded-xl p-3 flex-shrink-0">
            <p className="font-bold text-lg mb-2 text-white text-glow">Ô Quan {playerName}</p>

            {/* Quan Stone (Big Stone) */}
            {quanStone > 0 && (
                <div className="flex justify-center items-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full border-4 border-amber-900 flex items-center justify-center shadow-xl">
                        <span className="text-2xl">💎</span>
                    </div>
                </div>
            )}

            {/* Small Stones Count */}
            <p className="text-xs text-gray-100 font-semibold mb-1">Đá nhỏ:</p>
            <p className="text-3xl font-black text-white text-glow-accent">{stones}</p>
        </div>
    );
}
