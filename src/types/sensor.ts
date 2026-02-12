/**
 * sensor.ts — 感測器相關型別定義
 *
 * 集中管理所有與裝置感測器有關的 TypeScript 介面與型別，
 * 避免在多個元件中重複定義。
 */

// ─── 感測器原始資料結構 ───────────────────────────────────────

/** 三軸向量（用於方位角、加速度、旋轉速率） */
export interface AxisData {
    alpha: number;
    beta: number;
    gamma: number;
}

/** 加速度計向量（X / Y / Z） */
export interface MotionData {
    x: number;
    y: number;
    z: number;
}

/** 裝置感測器完整資料集 */
export interface SensorData {
    /** 方位角：alpha（航向）、beta（仰俯）、gamma（翻滾） */
    orientation: AxisData;
    /** 加速度計（含重力） */
    motion: MotionData;
    /** 陀螺儀旋轉速率 */
    rotationRate: AxisData;
}

// ─── iOS 13+ 權限 API 擴展 ───────────────────────────────────

/**
 * iOS 13 以上要求使用者手動授權 DeviceOrientation / DeviceMotion，
 * 此介面擴展原生 DeviceOrientationEvent 以包含 `requestPermission` 靜態方法。
 *
 * @see https://developer.apple.com/documentation/webkitjs/deviceorientationevent
 */
export interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
    requestPermission?: () => Promise<'granted' | 'denied'>;
}

// ─── 導覽列相關 ──────────────────────────────────────────────

/** 底部導覽列標籤 ID */
export type TabId = 'level' | 'sensors' | 'info';
