/**
 * Badge.tsx — 通用標籤元件
 *
 * 小型圓角標籤，支援多種顏色主題，用於狀態標示（如「即時」）。
 */

import type React from 'react';

/** 可選的標籤顏色 */
type BadgeColor = 'blue' | 'green' | 'amber' | 'emerald';

interface BadgeProps {
    children: React.ReactNode;
    /** 標籤顏色主題，預設 'blue' */
    color?: BadgeColor;
}

/** 各顏色對應的 Tailwind class map */
const COLOR_STYLES: Record<BadgeColor, string> = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
};

export const Badge: React.FC<BadgeProps> = ({ children, color = 'blue' }) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${COLOR_STYLES[color]}`}>
        {children}
    </span>
);
