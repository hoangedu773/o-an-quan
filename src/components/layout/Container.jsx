/**
 * Author: hoangedu773
 * GitHub: https://github.com/hoangedu773
 * Date: 2025-11-28
 * Description: Main container component with responsive layout
 */

export default function Container({ children }) {
    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
        </div>
    );
}
