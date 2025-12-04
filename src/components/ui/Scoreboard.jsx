/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Scoreboard component displaying player scores
 */

export default function Scoreboard({ scoreX, scoreO, playerXLabel, playerOLabel }) {
    return (
        <div className="glass flex flex-col md:flex-row justify-center gap-6 md:gap-12 mb-6 p-6 rounded-2xl">
            <div className="text-xl md:text-2xl font-bold text-center">
                <span className="text-gray-200">Người chơi X ({playerXLabel}):</span>{' '}
                <span className="text-player-x text-glow-accent text-3xl">{scoreX}</span>
            </div>
            <div className="hidden md:block w-px bg-white bg-opacity-30"></div>
            <div className="text-xl md:text-2xl font-bold text-center">
                <span className="text-gray-200">Người chơi O ({playerOLabel}):</span>{' '}
                <span className="text-player-o text-glow-accent text-3xl">{scoreO}</span>
            </div>
        </div>
    );
}
