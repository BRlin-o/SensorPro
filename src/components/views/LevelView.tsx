/**
 * LevelView.tsx — 水平儀視圖
 *
 * 以氣泡式水平儀呈現裝置前後（Beta）與左右（Gamma）傾斜角度。
 * 氣泡會隨裝置傾斜而移動，達到水平時變為綠色。
 */

import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import type { AxisData } from '../../types/sensor';

interface LevelViewProps {
    /** 方位角資料（僅使用 beta 與 gamma） */
    orientation: AxisData;
}

export function LevelView({ orientation }: LevelViewProps) {
    const { beta, gamma } = orientation;

    // 將角度映射為氣泡位置（beta / gamma 範圍 -90~90，乘 2 放大視覺效果）
    const bubbleX = Math.max(Math.min(gamma * 2, 100), -100);
    const bubbleY = Math.max(Math.min(beta * 2, 100), -100);

    // 前後與左右皆小於 1° 則視為「已水平」
    const isLevel = Math.abs(beta) < 1 && Math.abs(gamma) < 1;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">

            {/* ─── 水平儀圓盤 ────────────────────────────────────── */}
            <Card className="relative aspect-square flex items-center justify-center overflow-hidden">
                {/* 背景格線 */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-5">
                    {[...Array(36)].map((_, i) => (
                        <div key={i} className="border border-slate-900 dark:border-white" />
                    ))}
                </div>

                {/* 外圈 + 十字準線 */}
                <div className="relative w-64 h-64 rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center">
                    <div className="absolute w-full h-[1px] bg-slate-200 dark:bg-slate-700" />
                    <div className="absolute h-full w-[1px] bg-slate-200 dark:bg-slate-700" />
                    <div className="absolute w-12 h-12 rounded-full border border-slate-300 dark:border-slate-600 border-dashed" />

                    {/* 氣泡：以 spring 動畫平滑跟隨傾斜角度 */}
                    <motion.div
                        animate={{ x: bubbleX, y: bubbleY }}
                        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
                        className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center
              ${isLevel ? 'bg-emerald-500' : 'bg-blue-500'} transition-colors duration-300`}
                    >
                        <div className="w-4 h-4 rounded-full bg-white/30 blur-[2px]" />
                    </motion.div>
                </div>

                {/* 狀態文字 */}
                <div className="absolute bottom-4 right-4 text-xs font-mono text-slate-400">
                    {isLevel ? '已水平' : '調整中'}
                </div>
            </Card>

            {/* ─── Beta / Gamma 數值面板 ─────────────────────────── */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 flex flex-col items-center">
                    <span className="text-xs text-slate-500 mb-1 uppercase tracking-wider">前後傾斜 (Beta)</span>
                    <span className="text-2xl font-bold font-mono">{beta}°</span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <motion.div
                            animate={{ width: `${(Math.min(Math.abs(beta), 90) / 90) * 100}%` }}
                            className="h-full bg-blue-500"
                        />
                    </div>
                </Card>

                <Card className="p-4 flex flex-col items-center">
                    <span className="text-xs text-slate-500 mb-1 uppercase tracking-wider">左右傾斜 (Gamma)</span>
                    <span className="text-2xl font-bold font-mono">{gamma}°</span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <motion.div
                            animate={{ width: `${(Math.min(Math.abs(gamma), 90) / 90) * 100}%` }}
                            className="h-full bg-indigo-500"
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
