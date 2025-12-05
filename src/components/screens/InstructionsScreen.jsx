/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-12-05
 * Description: Instructions screen with detailed Vietnamese game rules
 */

import Button from '../ui/Button';

export default function InstructionsScreen({ onBack }) {
    return (
        <div className="glass w-full max-w-4xl mx-auto p-8 md:p-12 rounded-2xl shadow-2xl overflow-y-auto max-h-[85vh]">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-glow">
                📜 Hướng Dẫn Cách Chơi Ô Ăn Quan
            </h2>

            <div className="text-left text-gray-100 space-y-4 leading-relaxed">
                {/* Ô ăn quan là gì */}
                <div className="glass-dark p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-accent mb-2">🎮 Ô Ăn Quan là gì?</h3>
                    <p>
                        Ô ăn quan là một <strong>trò chơi dân gian</strong> thịnh hành dành cho trẻ em ở Việt Nam,
                        đặc biệt là trong thời kỳ trước khi công nghệ phát triển mạnh mẽ như hiện nay.
                        Trò chơi này thường có <strong>2 người</strong> cùng chơi. Đồ chơi của ô ăn quan thường là
                        những vật dụng đơn giản như đá, sỏi, có kích thước nhỏ phù hợp với tay người chơi.
                    </p>
                </div>

                {/* Bàn chơi */}
                <div className="glass-dark p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-accent mb-2">🎯 Bàn Chơi & Quân Cờ</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>
                            Bàn chơi có <strong>12 ô</strong>: 2 <strong>ô Quan</strong> (hình bán nguyệt ở hai đầu)
                            và 10 <strong>ô Dân</strong> (hình vuông ở giữa).
                        </li>
                        <li>
                            Mỗi ô Dân ban đầu có <strong>5 viên đá nhỏ</strong> (tổng 50 viên).
                        </li>
                        <li>
                            Mỗi ô Quan có <strong>1 viên đá to</strong> (gọi là Quan).
                        </li>
                        <li>
                            Mỗi người chơi quản lý <strong>5 ô Dân</strong> thuộc phía mình.
                        </li>
                    </ul>
                </div>

                {/* Cách rải quân */}
                <div className="glass-dark p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-accent mb-2">✋ Cách Rải Quân</h3>
                    <ol className="list-decimal list-inside ml-4 space-y-2">
                        <li>
                            Chọn <strong>1 ô Dân</strong> thuộc quyền quản lý của mình (có đá).
                        </li>
                        <li>
                            Nhặt hết số đá trong ô đó lên tay.
                        </li>
                        <li>
                            Chọn hướng rải: <strong>⬅️ Trái</strong> hoặc <strong>➡️ Phải</strong>.
                        </li>
                        <li>
                            Rải lần lượt <strong>mỗi ô 1 viên đá</strong> theo hướng đã chọn.
                        </li>
                    </ol>
                </div>

                {/* Các tình huống */}
                <div className="glass-dark p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-accent mb-2">🎲 Các Tình Huống Khi Rải</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>
                            <strong>Tiếp tục rải:</strong> Nếu ô liền kề sau ô cuối cùng được rải có quân,
                            tiếp tục lấy số quân đó và rải tiếp theo hướng cũ.
                        </li>
                        <li>
                            <strong>Ăn quân:</strong> Nếu ô liền kề là ô trống, sau đó đến ô có quân,
                            bạn sẽ <strong>ăn</strong> toàn bộ số quân trong ô đó.
                        </li>
                        <li>
                            <strong>Ăn liên tiếp:</strong> Nếu sau ô vừa ăn lại là ô trống + ô có quân,
                            tiếp tục ăn thêm!
                        </li>
                        <li>
                            <strong>Mất lượt:</strong> Nếu gặp 2 ô trống liên tiếp hoặc gặp ô Quan,
                            bạn sẽ mất lượt.
                        </li>
                    </ul>
                </div>

                {/* Luật đặc biệt */}
                <div className="glass-dark p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-accent mb-2">⚡ Luật Đặc Biệt</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>
                            <strong>Hết quân:</strong> Nếu đến lượt mà tất cả 5 ô Dân của bạn đều trống,
                            bạn phải dùng <strong>5 quân</strong> từ điểm đã ăn để rải lại (mỗi ô 1 quân).
                        </li>
                        <li>
                            <strong>Mượn quân:</strong> Nếu không đủ 5 quân, có thể mượn từ đối thủ
                            và trả lại khi tính điểm.
                        </li>
                        <li>
                            <strong>Ô nhà giàu:</strong> Ô chứa nhiều quân - chiến thuật tích quân để ăn lớn!
                        </li>
                    </ul>
                </div>

                {/* Kết thúc & Tính điểm */}
                <div className="glass-dark p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-accent mb-2">🏆 Kết Thúc & Tính Điểm</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>
                            Trò chơi kết thúc khi <strong>cả 2 ô Quan đều hết quân</strong>.
                        </li>
                        <li>
                            Nếu còn quân Dân, số quân thuộc về người quản lý hàng đó.
                        </li>
                        <li>
                            <strong>Quy đổi:</strong> 1 Quan = 10 Dân (hoặc 5 Dân tùy thỏa thuận).
                        </li>
                        <li>
                            Ai có <strong>tổng điểm cao hơn</strong> sẽ thắng!
                        </li>
                    </ul>
                </div>

                {/* Tips */}
                <div className="bg-yellow-500 bg-opacity-20 border border-yellow-400 p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">💡 Mẹo Chơi</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-yellow-100">
                        <li>Tính toán trước để ăn được nhiều quân trong 1 lượt.</li>
                        <li>Tích quân vào "ô nhà giàu" để ăn lớn.</li>
                        <li>Tránh để đối thủ ăn Quan của mình.</li>
                        <li>Quan sát bàn cờ và dự đoán nước đi của đối thủ.</li>
                    </ul>
                </div>
            </div>

            <Button
                variant="secondary"
                className="w-full mt-8"
                onClick={onBack}
            >
                ⬅️ QUAY LẠI MENU
            </Button>
        </div>
    );
}
