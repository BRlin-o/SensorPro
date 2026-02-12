/**
 * useSensorData.ts — 裝置感測器資料 Hook
 *
 * 封裝所有與瀏覽器 DeviceOrientation / DeviceMotion API 的互動邏輯：
 * 1. 偵測是否需要 iOS 權限授權
 * 2. 管理感測器資料的即時更新
 * 3. 透過 EMA 低通濾波 + RAF 節流平滑數據，提升 UX
 * 4. 提供 requestPermission 供 UI 呼叫
 *
 * @example
 * const { sensorData, needsPermission, requestPermission } = useSensorData();
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { SensorData, DeviceOrientationEventiOS } from '../types/sensor';

// ─── 常數 ─────────────────────────────────────────────────────

/** EMA 平滑因子（0~1）：越小越平滑、延遲越大；0.15 為推薦值 */
const SMOOTHING_FACTOR = 0.15;

const INITIAL_SENSOR_DATA: SensorData = {
    orientation: { alpha: 0, beta: 0, gamma: 0 },
    motion: { x: 0, y: 0, z: 0 },
    rotationRate: { alpha: 0, beta: 0, gamma: 0 },
};

// ─── 工具函式 ──────────────────────────────────────────────────

/**
 * 指數移動平均（Exponential Moving Average）
 * newVal = α × raw + (1-α) × prev
 */
function ema(prev: number, raw: number, alpha: number = SMOOTHING_FACTOR): number {
    return alpha * raw + (1 - alpha) * prev;
}

/**
 * 偵測是否需要 iOS 動態感測器權限授權。
 * iOS 13+ 設備的 DeviceOrientationEvent 具有 `requestPermission` 靜態方法，
 * 必須在使用者手勢事件中呼叫才能取得授權。
 */
function detectNeedsPermission(): boolean {
    const DOE = DeviceOrientationEvent as unknown as DeviceOrientationEventiOS;
    return (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DOE.requestPermission === 'function'
    );
}

// ─── Hook 本體 ───────────────────────────────────────────────

export function useSensorData() {
    const [sensorData, setSensorData] = useState<SensorData>(INITIAL_SENSOR_DATA);
    const [needsPermission, setNeedsPermission] = useState(detectNeedsPermission);

    // 用 ref 保存中間值，避免每次 setState
    const latestRef = useRef<SensorData>({ ...INITIAL_SENSOR_DATA });
    const rafRef = useRef<number>(0);

    /**
     * 註冊 deviceorientation / devicemotion 事件監聽器，
     * 回傳清除函式以供 useEffect 或手動清理使用。
     *
     * 使用 EMA 低通濾波平滑原始讀數，
     * 並以 requestAnimationFrame 節流，每動畫幀最多更新一次 state。
     */
    const startSensors = useCallback(() => {
        // --- 排程 RAF：將 latestRef 的平滑值寫入 React state ---
        const scheduleUpdate = () => {
            if (rafRef.current) return; // 已排程，跳過

            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = 0;
                const s = latestRef.current;
                setSensorData({
                    orientation: {
                        alpha: Math.round(s.orientation.alpha),
                        beta: Math.round(s.orientation.beta),
                        gamma: Math.round(s.orientation.gamma),
                    },
                    motion: {
                        x: Number(s.motion.x.toFixed(1)),
                        y: Number(s.motion.y.toFixed(1)),
                        z: Number(s.motion.z.toFixed(1)),
                    },
                    rotationRate: {
                        alpha: Number(s.rotationRate.alpha.toFixed(1)),
                        beta: Number(s.rotationRate.beta.toFixed(1)),
                        gamma: Number(s.rotationRate.gamma.toFixed(1)),
                    },
                });
            });
        };

        // --- 方位角事件（Compass heading + 仰俯 + 翻滾） ---
        const handleOrientation = (event: DeviceOrientationEvent) => {
            const prev = latestRef.current.orientation;
            latestRef.current = {
                ...latestRef.current,
                orientation: {
                    alpha: ema(prev.alpha, event.alpha ?? 0),
                    beta: ema(prev.beta, event.beta ?? 0),
                    gamma: ema(prev.gamma, event.gamma ?? 0),
                },
            };
            scheduleUpdate();
        };

        // --- 加速度 + 旋轉速率事件 ---
        const handleMotion = (event: DeviceMotionEvent) => {
            const prevMotion = latestRef.current.motion;
            const prevRotation = latestRef.current.rotationRate;
            latestRef.current = {
                ...latestRef.current,
                motion: {
                    x: ema(prevMotion.x, event.accelerationIncludingGravity?.x ?? 0),
                    y: ema(prevMotion.y, event.accelerationIncludingGravity?.y ?? 0),
                    z: ema(prevMotion.z, event.accelerationIncludingGravity?.z ?? 0),
                },
                rotationRate: {
                    alpha: ema(prevRotation.alpha, event.rotationRate?.alpha ?? 0),
                    beta: ema(prevRotation.beta, event.rotationRate?.beta ?? 0),
                    gamma: ema(prevRotation.gamma, event.rotationRate?.gamma ?? 0),
                },
            };
            scheduleUpdate();
        };

        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('devicemotion', handleMotion);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('devicemotion', handleMotion);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = 0;
            }
        };
    }, []);

    /**
     * 初始化感測器：
     * - 若不需要權限（Android / 舊版 iOS），直接啟動感測器
     * - 若需要權限（iOS 13+），等待使用者手動授權
     */
    useEffect(() => {
        if (!needsPermission) {
            return startSensors();
        }
    }, [needsPermission, startSensors]);

    /**
     * iOS 專用：向使用者請求運動感測器權限。
     * 授權成功後立即啟動感測器監聽。
     */
    const requestPermission = async () => {
        try {
            const DOE = DeviceOrientationEvent as unknown as DeviceOrientationEventiOS;

            if (typeof DOE.requestPermission === 'function') {
                const response = await DOE.requestPermission();

                if (response === 'granted') {
                    setNeedsPermission(false);
                    startSensors();
                }
            }
        } catch (error) {
            console.error('Sensor permission denied', error);
            alert(`Error requesting permission: ${error}`);
        }
    };

    return { sensorData, needsPermission, requestPermission } as const;
}
