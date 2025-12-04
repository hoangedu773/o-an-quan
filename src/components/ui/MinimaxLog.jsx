/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Minimax log panel for displaying AI thinking process
 */

import { useEffect, useRef } from 'react';

export default function MinimaxLog({ logs, isVisible }) {
    const logContentRef = useRef(null);

    useEffect(() => {
        if (logContentRef.current) {
            logContentRef.current.scrollTop = logContentRef.current.scrollHeight;
        }
    }, [logs]);

    if (!isVisible) return null;

    return (
        <div className="mt-6 max-w-4xl mx-auto text-left">
            <h3 className="text-lg font-bold text-white mb-0 p-3 glass rounded-t-xl">
                📊 Nhật Ký Tính Toán Minimax (AI)
            </h3>
            <div
                ref={logContentRef}
                className="glass-dark p-4 rounded-b-xl h-64 overflow-y-auto font-mono text-sm shadow-inner"
            >
                {logs.length === 0 ? (
                    <p className="text-gray-400">Chưa có log...</p>
                ) : (
                    logs.map((log, index) => (
                        <p
                            key={index}
                            className={log.isImportant ? 'text-yellow-300 font-bold' : 'text-gray-300'}
                        >
                            {log.message}
                        </p>
                    ))
                )}
            </div>
        </div>
    );
}
