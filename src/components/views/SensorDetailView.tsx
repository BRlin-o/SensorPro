/**
 * SensorDetailView.tsx — 感測器詳細數據視圖
 *
 * 顯示加速度計、陀螺儀、方位角三組即時資料，
 * 每組以卡片呈現，內含各軸數值與進度條動畫。
 *
 * 直屏：垂直堆疊三張卡片
 * 橫屏：三張卡片水平並排
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
    /** 是否為橫屏模式 */
    isLandscape: boolean;
}

export function SensorDetailView({ sensorData, isLandscape }: SensorDetailViewProps) {
    const sensors = [
        {
            label: '加速度計',
            labelSub: 'G-Sensor',
            data: sensorData.motion,
            icon: <Activity size={18} />,
            color: 'emerald' as const,
        },
        {
            label: '陀螺儀',
            labelSub: 'Gyro',
            data: sensorData.rotationRate,
            icon: <RotateCwIcon size={18} />,
            color: 'amber' as const,
        },
        {
            label: '方位角',
            labelSub: 'Alpha',
            data: { alpha: sensorData.orientation.alpha },
            icon: <Compass size={18} />,
            color: 'blue' as const,
        },
    ];

    return (
        <div className={`pb-20
            ${isLandscape
                ? 'flex flex-row gap-3 items-start'
                : 'flex flex-col gap-4'
            }`}
        >
            {sensors.map((s, idx) => (
                <Card key={idx} className={`overflow-hidden ${isLandscape ? 'flex-1 min-w-0' : ''}`}>
                    {/* 區塊標題列 */}
                    <div className={`flex justify-between items-center mb-4 ${isLandscape ? 'flex-wrap gap-2' : ''}`}>
                        <div className="flex items-center gap-2">
                            <div
                                className={`p-2 rounded-xl bg-${s.color}-100 dark:bg-${s.color}-900/30 text-${s.color}-600 dark:text-${s.color}-400`}
                            >
                                {s.icon}
                            </div>
                            <div>
                                <h3 className={`font-semibold ${isLandscape ? 'text-sm' : ''}`}>
                                    {s.label}
                                </h3>
                                {isLandscape && (
                                    <span className="text-[10px] text-slate-400">{s.labelSub}</span>
                                )}
                                {!isLandscape && (
                                    <span className="text-xs text-slate-400 ml-1">({s.labelSub})</span>
                                )}
                            </div>
                        </div>
                        <Badge color={s.color}>即時</Badge>
                    </div>

                    {/* 各軸數值 + 進度條 */}
                    <div className="space-y-4">
                        {Object.entries(s.data).map(([key, val]) => (
                            <div key={key}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-500 font-mono uppercase">{key} 軸</span>
                                    <span className="font-bold font-mono">{typeof val === 'number' ? val.toFixed(1) : val}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(Math.abs(val as number) * 10, 100)}%` }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
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
