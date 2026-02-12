/**
 * SensorDetailView.tsx — 感測器詳細數據視圖
 *
 * 顯示加速度計、陀螺儀、方位角三組即時資料，
 * 每組以卡片呈現，內含各軸數值與進度條動畫。
 */

import { motion } from 'framer-motion';
import { Activity, Compass } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RotateCwIcon } from '../icons/RotateCwIcon';
import type { SensorData } from '../../types/sensor';

interface SensorDetailViewProps {
    /** 完整的感測器資料（方位角 + 加速度 + 旋轉速率） */
    sensorData: SensorData;
}

export function SensorDetailView({ sensorData }: SensorDetailViewProps) {
    /**
     * 感測器區塊配置
     * 每個區塊定義：標籤、資料來源、圖示、顏色主題
     */
    const sensors = [
        {
            label: '加速度計 (G-Sensor)',
            data: sensorData.motion,
            icon: <Activity size={18} />,
            color: 'emerald' as const,
        },
        {
            label: '陀螺儀 (Gyro)',
            data: sensorData.rotationRate,
            icon: <RotateCwIcon size={18} />,
            color: 'amber' as const,
        },
        {
            label: '方位角 (Alpha)',
            data: { alpha: sensorData.orientation.alpha },
            icon: <Compass size={18} />,
            color: 'blue' as const,
        },
    ];

    return (
        <div className="flex flex-col gap-4 pb-20">
            {sensors.map((s, idx) => (
                <Card key={idx} className="overflow-hidden">
                    {/* 區塊標題列 */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <div
                                className={`p-2 rounded-xl bg-${s.color}-100 dark:bg-${s.color}-900/30 text-${s.color}-600 dark:text-${s.color}-400`}
                            >
                                {s.icon}
                            </div>
                            <h3 className="font-semibold">{s.label}</h3>
                        </div>
                        <Badge color={s.color}>即時</Badge>
                    </div>

                    {/* 各軸數值 + 進度條 */}
                    <div className="space-y-4">
                        {Object.entries(s.data).map(([key, val]) => (
                            <div key={key}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-500 font-mono uppercase">{key} 軸</span>
                                    <span className="font-bold">{val}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(Math.abs(val as number) * 10, 100)}%` }}
                                        className={`h-full bg-${s.color}-500 opacity-60`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            ))}
        </div>
    );
}
