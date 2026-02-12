/**
 * Header.tsx — 頂部標頭列
 *
 * 顯示 App 品牌名稱「SENSOR PRO」與設定按鈕。
 */

import { Settings2 } from 'lucide-react';

export function Header() {
    return (
        <header className="flex justify-between items-center mb-8 pt-4">
            {/* 品牌 Logo */}
            <div>
                <h1 className="text-2xl font-black tracking-tight">
                    SENSOR<span className="text-blue-500">PRO</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">手機傳感器中心</p>
            </div>

            {/* 設定按鈕（預留功能擴展） */}
            <button className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                <Settings2 size={20} />
            </button>
        </header>
    );
}
