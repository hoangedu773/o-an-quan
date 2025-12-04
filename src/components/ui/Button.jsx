/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Reusable Button component with Glassmorphism variants
 */

export default function Button({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    className = ''
}) {
    const baseClasses = 'px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'glass hover:bg-opacity-25 hover:scale-105 hover:shadow-xl',
        secondary: 'glass-dark hover:bg-opacity-95 hover:scale-105',
        danger: 'bg-red-500 bg-opacity-80 hover:bg-opacity-100 border-2 border-red-300 hover:scale-105 shadow-lg',
        success: 'bg-green-500 bg-opacity-80 hover:bg-opacity-100 border-2 border-green-300 hover:scale-105 shadow-lg',
        accent: 'bg-gradient-to-r from-accent to-yellow-500 text-gray-900 hover:scale-105 shadow-lg border-2 border-yellow-300',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
