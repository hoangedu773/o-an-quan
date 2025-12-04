/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Tailwind CSS configuration with custom Glassmorphism theme
 */

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'quan': '#F97316',
                'player-x': '#06B6D4',
                'player-o': '#EC4899',
                'accent': '#FBBF24',
            },
            backdropBlur: {
                xs: '2px',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'sow': 'sow 0.3s ease-in-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                sow: {
                    '0%': { transform: 'scale(1)', boxShadow: '0 0 15px rgba(253, 224, 71, 1)' },
                    '50%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
                }
            }
        },
    },
    plugins: [],
}
