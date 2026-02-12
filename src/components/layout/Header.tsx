/**
 * Header.tsx — 頂部標頭列
 *
 * 顯示 App 品牌名稱「SENSOR PRO」與設定按鈕。
 * 橫屏時更緊湊：隱藏副標題、縮小 Logo、減少邊距。
 */

import { Settings2 } from 'lucide-react';

interface HeaderProps {
    /** 是否為橫屏模式 */
    isLandscape: boolean;
}

export function Header({ isLandscape }: HeaderProps) {
    return (
        <header className={`flex justify-between items-center pt-4 ${isLandscape ? 'mb-3' : 'mb-8'}`}>
            {/* 品牌 Logo */}
            <div>
                <h1 className={`font-black tracking-tight ${isLandscape ? 'text-base' : 'text-2xl'}`}>
                    SENSOR<span className="text-blue-500">PRO</span>
                </h1>
                {!isLandscape && (
                    <p className="text-xs text-slate-400 font-medium">手機傳感器中心</p>
                )}
            </div>

            {/* 設定按鈕（預留功能擴展） */}
            <button className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                <Settings2 size={isLandscape ? 16 : 20} />
            </button>
        </header>
    );
}
