/**
 * InfoView.tsx — 資訊頁
 *
 * 靜態內容，介紹 App 使用的三種 MEMS 感測器：
 * 加速計、陀螺儀、磁力計。
 */

import { Zap, Maximize2, Navigation } from 'lucide-react';
import { Card } from '../ui/Card';

/** 感測器介紹項目 */
const SENSOR_INFO = [
    { title: '加速計', desc: '測量線性加速度與重力感應。', icon: <Zap /> },
    { title: '陀螺儀', desc: '檢測設備旋轉的角速度。', icon: <Maximize2 /> },
    { title: '磁力計', desc: '感應地球磁場，用於電子羅盤。', icon: <Navigation /> },
] as const;

export function InfoView() {
    return (
        <div className="flex flex-col gap-6">
            {/* 關於本 App 的漸層標頭卡片 */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
                <h2 className="text-xl font-bold mb-2">關於傳感器 App</h2>
                <p className="text-blue-100 text-sm leading-relaxed">
                    這款工具利用您手機內建的 MEMS 傳感器（微機電系統）來提供即時數據。
                    這包含了精確的重力感應與旋轉速率監測。
                </p>
            </Card>

            {/* 三種感測器簡介 */}
            <div className="space-y-3">
                {SENSOR_INFO.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50"
                    >
                        <div className="text-blue-500">{item.icon}</div>
                        <div>
                            <h4 className="font-bold text-sm">{item.title}</h4>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 版本資訊 */}
            <div className="p-4 text-center">
                <p className="text-xs text-slate-400">版本 1.0.0 • 台灣開發</p>
            </div>
        </div>
    );
}
