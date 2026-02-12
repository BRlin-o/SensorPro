/**
 * LevelView.tsx — 水平儀視圖
 *
 * 以氣泡式水平儀呈現裝置前後（Beta）與左右（Gamma）傾斜角度。
 * 氣泡會隨裝置傾斜而移動，達到水平時變為綠色。
 *
 * 直屏：圓盤在上、數值面板在下（垂直排列）
 * 橫屏：圓盤在左、數值面板在右（水平排列）
 *
 * 橫屏軸映射：
 * DeviceOrientation API 的 beta/gamma 是相對於裝置物理座標系：
 * - beta：繞 X 軸旋轉（直屏時的前後傾斜）
 * - gamma：繞 Y 軸旋轉（直屏時的左右傾斜）
 *
 * 當裝置橫放（90°）：使用者的「左右」對應物理 beta，「前後」對應物理 gamma
 * 當裝置橫放（270°）：方向相反，需要取反
 */

import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import type { AxisData } from '../../types/sensor';

interface LevelViewProps {
    /** 方位角資料（僅使用 beta 與 gamma） */
    orientation: AxisData;
    /** 是否為橫屏模式 */
    isLandscape: boolean;
    /** 螢幕旋轉角度（0 / 90 / 180 / 270） */
    screenAngle: number;
}

export function LevelView({ orientation, isLandscape, screenAngle }: LevelViewProps) {
    const { beta: rawBeta, gamma: rawGamma } = orientation;

    // ─── 根據螢幕方向映射軸線 ────────────────────────────────
    // 直屏：直接使用原始值
    // 橫屏 90°（順時針）：左右 = beta，前後 = gamma
    // 橫屏 270°（逆時針）：左右 = -beta，前後 = -gamma
    let visualBeta: number;   // 使用者感知的「前後傾斜」
    let visualGamma: number;  // 使用者感知的「左右傾斜」

    if (screenAngle === 90) {
        visualBeta = -rawGamma;
        visualGamma = rawBeta;
    } else if (screenAngle === 270) {
        visualBeta = rawGamma;
        visualGamma = -rawBeta;
    } else {
        visualBeta = rawBeta;
        visualGamma = rawGamma;
    }

    // 將角度映射為氣泡位置（範圍 -90~90，乘 2 放大視覺效果）
    const bubbleX = Math.max(Math.min(visualGamma * 2, 100), -100);
    const bubbleY = Math.max(Math.min(visualBeta * 2, 100), -100);

    // 前後與左右皆小於 2° 則視為「已水平」
    const isLevel = Math.abs(visualBeta) < 2 && Math.abs(visualGamma) < 2;

    return (
        <div className={`animate-in fade-in duration-500
            ${isLandscape
                ? 'flex flex-row gap-4 items-stretch h-[calc(100vh-5rem)] h-[calc(100dvh-5rem)]'
                : 'flex flex-col gap-6'
            }`}
        >
            {/* ─── 水平儀圓盤 ────────────────────────────────────── */}
            <Card className={`relative flex items-center justify-center overflow-hidden
                ${isLandscape ? 'aspect-square h-full flex-shrink-0' : 'aspect-square'}`}
            >
                {/* 背景格線 */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-5">
                    {[...Array(36)].map((_, i) => (
                        <div key={i} className="border border-slate-900 dark:border-white" />
                    ))}
                </div>

                {/* 外圈 + 十字準線 */}
                <div className={`relative rounded-full border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center
                    ${isLandscape ? 'w-[min(16rem,80%)] h-[min(16rem,80%)]' : 'w-64 h-64'}`}
                >
                    <div className="absolute w-full h-[1px] bg-slate-200 dark:bg-slate-700" />
                    <div className="absolute h-full w-[1px] bg-slate-200 dark:bg-slate-700" />
                    <div className="absolute w-12 h-12 rounded-full border border-slate-300 dark:border-slate-600 border-dashed" />

                    {/* 氣泡：以 spring 動畫平滑跟隨傾斜角度 */}
                    <motion.div
                        animate={{ x: bubbleX, y: bubbleY }}
                        transition={{ type: 'spring', damping: 25, stiffness: 100 }}
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
            <div className={`gap-4
                ${isLandscape ? 'flex flex-col flex-1 min-w-0' : 'grid grid-cols-2'}`}
            >
                <Card className="p-4 flex flex-col items-center flex-1">
                    <span className="text-xs text-slate-500 mb-1 uppercase tracking-wider">前後傾斜 (Beta)</span>
                    <span className="text-2xl font-bold font-mono">{Math.round(-visualBeta)}°</span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <motion.div
                            animate={{ width: `${(Math.min(Math.abs(-visualBeta), 90) / 90) * 100}%` }}
                            className="h-full bg-blue-500"
                        />
                    </div>
                </Card>

                <Card className="p-4 flex flex-col items-center flex-1">
                    <span className="text-xs text-slate-500 mb-1 uppercase tracking-wider">左右傾斜 (Gamma)</span>
                    <span className="text-2xl font-bold font-mono">{Math.round(visualGamma)}°</span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <motion.div
                            animate={{ width: `${(Math.min(Math.abs(visualGamma), 90) / 90) * 100}%` }}
                            className="h-full bg-indigo-500"
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
