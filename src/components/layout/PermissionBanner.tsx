/**
 * PermissionBanner.tsx — iOS 感測器權限提示橫幅
 *
 * 當偵測到 iOS 13+ 且尚未授予動態感測器權限時顯示，
 * 引導使用者點擊按鈕以觸發原生權限對話框。
 */

import { AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';

interface PermissionBannerProps {
    /** 點擊「立即啟用」時的回呼 */
    onRequestPermission: () => void;
}

export function PermissionBanner({ onRequestPermission }: PermissionBannerProps) {
    return (
        <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900">
            <div className="flex gap-4 items-start">
                <AlertCircle className="text-amber-500 shrink-0 mt-1" />
                <div>
                    <h3 className="font-bold text-amber-800 dark:text-amber-400">
                        需要傳感器權限
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-500 mb-4 leading-snug">
                        為了顯示精確的水平儀與數據，請允許存取您設備的運動傳感器。
                    </p>
                    <button
                        onClick={onRequestPermission}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
                    >
                        立即啟用
                    </button>
                </div>
            </div>
        </Card>
    );
}
