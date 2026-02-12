/**
 * useSensorData.ts — 裝置感測器資料 Hook
 *
 * 封裝所有與瀏覽器 DeviceOrientation / DeviceMotion API 的互動邏輯：
 * 1. 偵測是否需要 iOS 權限授權
 * 2. 管理感測器資料的即時更新
 * 3. 提供 requestPermission 供 UI 呼叫
 *
 * @example
 * const { sensorData, needsPermission, requestPermission } = useSensorData();
 */

import { useState, useEffect, useCallback } from 'react';
import type { SensorData, DeviceOrientationEventiOS } from '../types/sensor';

// ─── 初始值 ──────────────────────────────────────────────────

const INITIAL_SENSOR_DATA: SensorData = {
    orientation: { alpha: 0, beta: 0, gamma: 0 },
    motion: { x: 0, y: 0, z: 0 },
    rotationRate: { alpha: 0, beta: 0, gamma: 0 },
};

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

    /**
     * 註冊 deviceorientation / devicemotion 事件監聽器，
     * 回傳清除函式以供 useEffect 或手動清理使用。
     */
    const startSensors = useCallback(() => {
        // --- 方位角事件（Compass heading + 仰俯 + 翻滾） ---
        const handleOrientation = (event: DeviceOrientationEvent) => {
            setSensorData(prev => ({
                ...prev,
                orientation: {
                    alpha: Number(event.alpha?.toFixed(1)) || 0,
                    beta: Number(event.beta?.toFixed(1)) || 0,
                    gamma: Number(event.gamma?.toFixed(1)) || 0,
                },
            }));
        };

        // --- 加速度 + 旋轉速率事件 ---
        const handleMotion = (event: DeviceMotionEvent) => {
            setSensorData(prev => ({
                ...prev,
                motion: {
                    x: Number(event.accelerationIncludingGravity?.x?.toFixed(2)) || 0,
                    y: Number(event.accelerationIncludingGravity?.y?.toFixed(2)) || 0,
                    z: Number(event.accelerationIncludingGravity?.z?.toFixed(2)) || 0,
                },
                rotationRate: {
                    alpha: Number(event.rotationRate?.alpha?.toFixed(2)) || 0,
                    beta: Number(event.rotationRate?.beta?.toFixed(2)) || 0,
                    gamma: Number(event.rotationRate?.gamma?.toFixed(2)) || 0,
                },
            }));
        };

        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('devicemotion', handleMotion);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, []);

    /**
     * 初始化感測器：
     * - 若不需要權限（Android / 舊版 iOS），直接啟動感測器
     * - 若需要權限（iOS 13+），等待使用者手動授權
     */
    useEffect(() => {
        if (!needsPermission) {
            startSensors();
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
