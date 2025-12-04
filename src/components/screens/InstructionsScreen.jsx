/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Instructions screen with game rules
 */

import Button from '../ui/Button';

export default function InstructionsScreen({ onBack }) {
    return (
        <div className="glass w-full max-w-4xl mx-auto p-8 md:p-12 rounded-2xl shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-glow">
                📜 Hướng Dẫn Cách Chơi Ô Ăn Quan
            </h2>

            <div className="text-left text-gray-100 space-y-4 leading-relaxed">
                <div className="glass-dark p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-accent mb-2">1. Thiết lập</h3>
                    <p>
                        Bàn cờ có <strong>12 ô</strong>: 2 ô Quan (lớn ở hai đầu) và 10 ô Dân (nhỏ ở giữa).
                        Mỗi ô Dân ban đầu có <strong>5 viên đá nhỏ</strong>.
                        Mỗi ô Quan có <strong>1 viên đá to</strong> (trị giá 10 đá nhỏ).
                    </p>
                </div>

                <div className="glass-dark p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-accent mb-2">2. Rải quân</h3>
                    <p>
                        Người chơi chọn một ô Dân của mình có đá và <strong>rải lần lượt</strong> từng viên đá
                        theo một hướng (xuôi hoặc ngược chiều kim đồng hồ) cho đến khi hết đá trên tay.
                    </p>
                </div>

                <div className="glass-dark p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-accent mb-2">3. Ăn quân (Capture)</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>
                            <strong>Hốt/Tiếp tục:</strong> Nếu viên đá cuối cùng rơi vào một ô có chứa đá
                            (không phải ô trống), người chơi <strong>hốt</strong> toàn bộ số đá trong ô đó
                            và tiếp tục rải (từ ô tiếp theo) theo cùng hướng.
                        </li>
                        <li>
                            <strong>Ăn:</strong> Nếu viên đá cuối cùng rơi vào <strong>ô trống</strong>
                            (không tính ô Quan), và ô kế tiếp sau ô trống đó có chứa đá (Dân hoặc Quan),
                            người chơi sẽ <strong>ăn</strong> toàn bộ số đá (kể cả đá to) trong ô đó và ô tiếp theo sau nó.
                        </li>
                    </ul>
                </div>

                <div className="glass-dark p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-accent mb-2">4. Luật Gieo</h3>
                    <p>
                        Nếu đến lượt người chơi mà <strong>tất cả 5 ô Dân</strong> của họ đều trống,
                        họ phải dùng <strong>10 viên đá nhỏ</strong> từ điểm đã ăn của mình để rải lại vào 10 ô Dân
                        (mỗi ô 1 viên). Nếu không đủ 10 viên, trò chơi kết thúc.
                    </p>
                </div>

                <div className="glass-dark p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-accent mb-2">5. Kết thúc</h3>
                    <p>
                        Trò chơi kết thúc khi cả hai ô Quan không còn viên đá to nào.
                        Toàn bộ số đá Dân còn lại trên sân thuộc về người chơi sở hữu hàng đó (luật <strong>"Chán"</strong>).
                        Ai có tổng điểm (đã ăn + Chán) lớn hơn sẽ <strong>thắng</strong>.
                    </p>
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
