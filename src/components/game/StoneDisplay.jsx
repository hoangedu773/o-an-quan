/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Stone display component showing visual stones as dots
 */

export default function StoneDisplay({ count, maxDisplay = 30 }) {
    const stonesToShow = Math.min(count, maxDisplay);
    const remaining = count > maxDisplay ? count - maxDisplay : 0;

    return (
        <div className="stones-display flex flex-wrap justify-center max-h-20 overflow-hidden items-center mb-2">
            {Array.from({ length: stonesToShow }).map((_, index) => (
                <span
                    key={index}
                    className="w-2 h-2 bg-pink-900 rounded-full m-0.5 shadow-sm"
                />
            ))}
            {remaining > 0 && (
                <span className="text-xs font-bold ml-1 text-gray-700">
                    +{remaining}
                </span>
            )}
        </div>
    );
}
