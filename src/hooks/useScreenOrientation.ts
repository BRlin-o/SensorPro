/**
 * useScreenOrientation.ts — 螢幕方向偵測 Hook
 *
 * 監聽 Screen Orientation API（或 fallback 至 window.orientation），
 * 回傳當前螢幕旋轉角度、是否為橫屏、以及全螢幕控制函式。
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
 */

import { useState, useEffect, useCallback } from 'react';

// ─── 工具函式 ──────────────────────────────────────────────────

/** 取得當前螢幕旋轉角度（0 / 90 / 180 / 270） */
function getScreenAngle(): number {
    // 優先使用標準 Screen Orientation API
    if (window.screen?.orientation?.angle != null) {
        return window.screen.orientation.angle;
    }
    // Fallback：window.orientation（已棄用但 iOS Safari 仍支援）
    if (typeof window.orientation === 'number') {
        return ((window.orientation as number) + 360) % 360;
    }
    return 0;
}

// ─── Hook 本體 ───────────────────────────────────────────────

export function useScreenOrientation() {
    const [angle, setAngle] = useState(getScreenAngle);

    useEffect(() => {
        const update = () => setAngle(getScreenAngle());

        // 標準 API
        if (window.screen?.orientation) {
            window.screen.orientation.addEventListener('change', update);
        }
        // Fallback 事件
        window.addEventListener('orientationchange', update);
        window.addEventListener('resize', update);

        return () => {
            window.screen?.orientation?.removeEventListener('change', update);
            window.removeEventListener('orientationchange', update);
            window.removeEventListener('resize', update);
        };
    }, []);

    /**
     * 嘗試進入全螢幕模式。
     * 需在使用者手勢（如 click）中呼叫，否則瀏覽器會拒絕。
     * 失敗時靜默忽略。
     */
    const requestFullscreen = useCallback(async () => {
        try {
            const el = document.documentElement as HTMLElement & {
                webkitRequestFullscreen?: () => Promise<void>;
            };
            if (el.requestFullscreen) {
                await el.requestFullscreen();
            } else if (el.webkitRequestFullscreen) {
                await el.webkitRequestFullscreen();
            }
        } catch {
            // 靜默忽略：非使用者手勢觸發或不支援
        }
    }, []);

    /** 退出全螢幕 */
    const exitFullscreen = useCallback(async () => {
        try {
            const doc = document as Document & {
                webkitExitFullscreen?: () => Promise<void>;
            };
            if (document.fullscreenElement) {
                if (doc.exitFullscreen) await doc.exitFullscreen();
                else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
            }
        } catch {
            // 靜默忽略
        }
    }, []);

    const isLandscape = angle === 90 || angle === 270;

    return {
        /** 螢幕旋轉角度（0 / 90 / 180 / 270） */
        angle,
        /** 是否為橫屏 */
        isLandscape,
        /** 嘗試進入全螢幕（需使用者手勢） */
        requestFullscreen,
        /** 退出全螢幕 */
        exitFullscreen,
    } as const;
}
