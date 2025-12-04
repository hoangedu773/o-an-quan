/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Dan box component (small playable boxes)
 */

import { useState } from 'react';
import StoneDisplay from './StoneDisplay';

export default function DanBox({ index, stones, isActive, onClick, player, isAnimating = false }) {
    const [isHovered, setIsHovered] = useState(false);

    const getBoxClass = () => {
        if (player === 'X') {
            return 'glass-player-x';
        } else if (player === 'O') {
            return 'glass-player-o';
        }
        return 'glass';
    };

    const baseClass = getBoxClass();
    const activeClass = isActive ? 'cursor-pointer hover:scale-105' : 'opacity-60 cursor-not-allowed';
    const animateClass = isAnimating ? 'animate-sow' : '';
    const hoverClass = isHovered && isActive ? 'ring-4 ring-accent ring-opacity-60' : '';

    return (
        <div
            onClick={isActive ? onClick : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`${baseClass} ${activeClass} ${animateClass} ${hoverClass} 
        flex flex-col justify-center items-center w-28 h-36 md:w-32 md:h-40 m-1 rounded-xl p-2 
        transition-all duration-200 shadow-lg`}
        >
            <p className="mb-1 text-xs text-gray-600 font-semibold">Ô {index}</p>

            <StoneDisplay count={stones} maxDisplay={30} />

            <p className="text-2xl font-black text-gray-800 mt-1">{stones}</p>
        </div>
    );
}
