/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Direction chooser component for selecting sow direction
 */

import Button from '../ui/Button';

export default function DirectionChooser({ boxIndex, onChoose, onCancel }) {
    return (
        <div className="glass text-center mb-4 p-4 rounded-xl border-2 border-blue-300 border-opacity-40">
            <p className="font-semibold text-lg mb-3 text-white">
                Chọn hướng rải quân từ ô <span className="text-accent text-2xl">{boxIndex}</span>:
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
                <Button variant="primary" onClick={() => onChoose(-1)}>
                    ⬅️ Trái
                </Button>
                <Button variant="primary" onClick={() => onChoose(1)}>
                    ➡️ Phải
                </Button>
            </div>
        </div>
    );
}
