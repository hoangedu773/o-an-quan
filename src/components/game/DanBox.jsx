/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-05
 * Description: Dan box component with hand and capture animations
 */

import { useState } from 'react';
import StoneDisplay from './StoneDisplay';

export default function DanBox({
    index,
    stones,
    isActive,
    onClick,
    player,
    isAnimating = false,
    isCapturing = false,
    hasHand = false
}) {
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
    const animateClass = isAnimating ? 'animate-sow ring-4 ring-yellow-400' : '';
    const hoverClass = isHovered && isActive ? 'ring-4 ring-accent ring-opacity-60' : '';

    // Capture animation - red glow
    const captureClass = isCapturing
        ? 'animate-pulse ring-4 ring-red-500 scale-110 bg-red-500 bg-opacity-30'
        : '';

    return (
        <div
            onClick={isActive ? onClick : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`${baseClass} ${activeClass} ${animateClass} ${hoverClass} ${captureClass}
                relative flex flex-col justify-center items-center w-28 h-36 md:w-32 md:h-40 m-1 rounded-xl p-2 
                transition-all duration-200 shadow-lg`}
        >
            {/* Hand cursor animation */}
            {hasHand && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce z-20">
                    ✋
                </div>
            )}

            {/* Capture indicator */}
            {isCapturing && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce z-10">
                    🎯 ĂN!
                </div>
            )}

            <p className="mb-1 text-xs text-gray-600 font-semibold">Ô {index}</p>

            <StoneDisplay count={stones} maxDisplay={30} />

            <p className={`text-2xl font-black mt-1 ${isCapturing ? 'text-red-600' : 'text-gray-800'}`}>
                {stones}
            </p>
        </div>
    );
}
