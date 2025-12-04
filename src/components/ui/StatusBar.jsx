/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Status bar showing current game state
 */

export default function StatusBar({ message, isAI = false }) {
    const bgClass = isAI
        ? 'bg-purple-500 bg-opacity-30 border-purple-300'
        : 'bg-yellow-400 bg-opacity-30 border-yellow-300';

    return (
        <div className={`${bgClass} border-2 text-center text-xl md:text-2xl font-semibold mb-4 p-4 rounded-xl backdrop-blur-sm`}>
            {message}
        </div>
    );
}
