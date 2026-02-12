/**
 * BottomNav.tsx — 導覽列
 *
 * 直屏：浮動式底部 Tab 導覽
 * 橫屏：右側垂直側邊欄
 *
 * 使用 Framer Motion layoutId 實現背景滑動動畫。
 * 支援三個頁籤：水平儀 / 傳感器 / 資訊。
 */

import React from 'react';
import { Move, Activity, Info, type LucideProps } from 'lucide-react';
import { motion } from 'framer-motion';
import type { TabId } from '../../types/sensor';

interface BottomNavProps {
    /** 當前選中的 Tab */
    activeTab: TabId;
    /** Tab 切換回呼 */
    onTabChange: (tab: TabId) => void;
    /** 是否為橫屏模式 */
    isLandscape: boolean;
}

/** Tab 配置：id、圖示、中文標籤 */
const TABS: { id: TabId; icon: React.ReactElement; label: string }[] = [
    { id: 'level', icon: <Move />, label: '水平儀' },
    { id: 'sensors', icon: <Activity />, label: '傳感器' },
    { id: 'info', icon: <Info />, label: '資訊' },
];

export function BottomNav({ activeTab, onTabChange, isLandscape }: BottomNavProps) {
    // 橫屏：右側垂直側邊欄
    if (isLandscape) {
        return (
            <nav className="fixed right-0 top-0 h-full w-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-l border-white/20 dark:border-slate-800 flex flex-col items-center justify-center gap-2 py-4 z-50">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all
                            ${activeTab === tab.id ? 'text-blue-500' : 'text-slate-400'}`}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="nav-bg"
                                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl -z-10"
                            />
                        )}
                        {React.cloneElement(tab.icon, { size: 22 } as LucideProps)}
                    </button>
                ))}
            </nav>
        );
    }

    // 直屏：底部浮動導覽列
    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-3xl p-2 shadow-2xl flex justify-between items-center z-50">
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition-all relative ${activeTab === tab.id ? 'text-blue-500' : 'text-slate-400'
                        }`}
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="nav-bg"
                            className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl -z-10"
                        />
                    )}
                    {React.cloneElement(tab.icon, { size: 20 } as LucideProps)}
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                        {tab.label}
                    </span>
                </button>
            ))}
        </nav>
    );
}
