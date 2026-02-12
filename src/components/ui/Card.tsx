/**
 * Card.tsx — 通用卡片容器元件
 *
 * 提供統一的圓角、陰影、邊框樣式，支持 dark mode。
 * 可透過 className prop 覆寫或追加樣式。
 */

import type React from 'react';

interface CardProps {
    children: React.ReactNode;
    /** 額外的 Tailwind class，用於覆寫預設樣式 */
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
    <div
        className={`bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 ${className}`}
    >
        {children}
    </div>
);
