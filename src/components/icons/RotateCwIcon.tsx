/**
 * RotateCwIcon.tsx — 順時針旋轉圖示
 *
 * 自訂 SVG 圖示，用於陀螺儀區塊。
 * 因 lucide-react 無直接對應圖示，故手動繪製。
 * 介面與 lucide-react 的 LucideProps 相容。
 */

import type { LucideProps } from 'lucide-react';

export function RotateCwIcon({ size }: LucideProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
        </svg>
    );
}
