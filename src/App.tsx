/**
 * App.tsx — SensorPro 應用入口
 *
 * 此檔案負責：
 * 1. 管理當前 Tab 狀態（水平儀 / 感測器 / 資訊）
 * 2. 呼叫 useSensorData Hook 取得感測器資料
 * 3. 偵測螢幕方向，橫屏時使用橫向佈局
 * 4. 組合各子元件形成完整頁面佈局
 *
 * 橫屏處理策略：
 * - 不再旋轉容器，改以 CSS media query 與 isLandscape prop 驅動橫向佈局
 * - 導覽列移至右側垂直欄
 * - 各 View 內部切換為水平排版
 */

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

// Types
import type { TabId } from './types/sensor';

// Hooks
import { useSensorData } from './hooks/useSensorData';
import { useScreenOrientation } from './hooks/useScreenOrientation';

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

  // 螢幕方向偵測
  const { angle, isLandscape } = useScreenOrientation();

  return (
    <div className={`bg-slate-50 dark:bg-black ${isLandscape ? 'landscape-shell' : ''}`}>
      <div
        className={`min-h-screen text-slate-900 dark:text-slate-100 font-sans p-4 pb-24
          ${isLandscape ? 'landscape-main' : 'max-w-md mx-auto'}`}
      >
        {/* 頂部標頭 */}
        <Header isLandscape={isLandscape} />

        {/* iOS 權限提示（僅在需要授權時顯示） */}
        {needsPermission && (
          <PermissionBanner onRequestPermission={requestPermission} />
        )}

        {/* 主要內容區：依 Tab 切換顯示不同 View */}
        <main>
          <AnimatePresence mode="wait">
            {activeTab === 'level' && (
              <LevelView key="level" orientation={sensorData.orientation} isLandscape={isLandscape} screenAngle={angle} />
            )}
            {activeTab === 'sensors' && (
              <SensorDetailView key="sensors" sensorData={sensorData} isLandscape={isLandscape} />
            )}
            {activeTab === 'info' && <InfoView key="info" isLandscape={isLandscape} />}
          </AnimatePresence>
        </main>

        {/* 導覽列：直屏在底部，橫屏在右側 */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} isLandscape={isLandscape} />
      </div>
    </div>
  );
}
