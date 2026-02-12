/**
 * App.tsx — SensorPro 應用入口
 *
 * 此檔案僅負責：
 * 1. 管理當前 Tab 狀態（水平儀 / 感測器 / 資訊）
 * 2. 呼叫 useSensorData Hook 取得感測器資料
 * 3. 組合各子元件形成完整頁面佈局
 *
 * 所有業務邏輯、UI 元件、型別定義皆已拆分至獨立模組，
 * 詳見 src/types/、src/hooks/、src/components/ 目錄。
 */

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Types
import type { TabId } from './types/sensor';

// Hooks
import { useSensorData } from './hooks/useSensorData';

// Layout Components
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { PermissionBanner } from './components/layout/PermissionBanner';

// View Components
import { LevelView } from './components/views/LevelView';
import { SensorDetailView } from './components/views/SensorDetailView';
import { InfoView } from './components/views/InfoView';

// ─── App 主元件 ──────────────────────────────────────────────

export default function App() {
  // 當前選中的 Tab
  const [activeTab, setActiveTab] = useState<TabId>('level');

  // 感測器資料 + iOS 權限管理
  const { sensorData, needsPermission, requestPermission } = useSensorData();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 font-sans p-4 pb-24 max-w-md mx-auto">
      {/* 頂部標頭 */}
      <Header />

      {/* iOS 權限提示（僅在需要授權時顯示） */}
      {needsPermission && (
        <PermissionBanner onRequestPermission={requestPermission} />
      )}

      {/* 主要內容區：依 Tab 切換顯示不同 View */}
      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'level' && (
            <LevelView key="level" orientation={sensorData.orientation} />
          )}
          {activeTab === 'sensors' && (
            <SensorDetailView key="sensors" sensorData={sensorData} />
          )}
          {activeTab === 'info' && <InfoView key="info" />}
        </AnimatePresence>
      </main>

      {/* 底部導覽列 */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
