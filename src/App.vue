<script setup>
import { ref } from 'vue'
import DataImporter from './components/DataImporter.vue'
import CustomerHeader from './components/CustomerHeader.vue'
import ConceptTimeline from './components/ConceptTimeline.vue'
import CoverageProgress from './components/CoverageProgress.vue'
import ScenarioCalculator from './components/ScenarioCalculator.vue'

// 應用程式的狀態管理
const isDataLoaded = ref(false) // 判斷是否已經有資料了
const currentView = ref('concept') 
const globalClientData = ref(null) // 用來儲存從 Importer 傳進來的資料

// 接收從 DataImporter 傳來的資料，並切換畫面
const startDashboard = (data) => {
  globalClientData.value = data
  isDataLoaded.value = true
}

// 重新載入，回到首頁
const resetApp = () => {
  isDataLoaded.value = false
  globalClientData.value = null
  currentView.value = 'concept'
}
</script>

<template>
  <div class="app-background">
    <main class="mobile-container">
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h1 class="app-title" style="margin-bottom: 0;">專屬保單健診</h1>
        <button v-if="isDataLoaded" @click="resetApp" style="background: none; border: none; color: #888; cursor: pointer; text-decoration: underline;">
          重新匯入
        </button>
      </div>
      
      <div v-if="!isDataLoaded">
        <DataImporter @data-loaded="startDashboard" />
      </div>

      <div v-else class="fade-in">
        <CustomerHeader :currentView="currentView" :clientData="globalClientData.client" />

        <div class="tab-container">
          <button class="tab-btn" :class="{ active: currentView === 'concept' }" @click="currentView = 'concept'">
            💡 醫療觀念
          </button>
          <button class="tab-btn" :class="{ active: currentView === 'dashboard' }" @click="currentView = 'dashboard'">
            📊 數據健診
          </button>
        </div>
        
        <div class="view-content">
          <div v-if="currentView === 'concept'" class="fade-in">
            <ConceptTimeline />
          </div>
          
          <div v-if="currentView === 'dashboard'" class="fade-in">
            <CoverageProgress :coverageData="globalClientData.coverage" />
            <ScenarioCalculator />
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<style>
/* 覆蓋 Vue 預設樣式，確保跨裝置置中 */
#app {
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  text-align: left !important;
}

:root {
  --bg-color: #f0f2f5;
  --text-color: #1a1a1a;
  --card-bg: #ffffff;
  --card-shadow: 0 4px 12px rgba(0,0,0,0.05);
  --primary-color: #4caf50; /* 主題綠色 */
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #121212;
    --text-color: #e0e0e0;
    --card-bg: #1e1e1e;
    --card-shadow: 0 4px 12px rgba(0,0,0,0.5);
  }
}

body {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang TC', 'Microsoft JhengHei', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
}
</style>

<style scoped>
.app-background {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 20px 15px;
  box-sizing: border-box;
}
.mobile-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}
.app-title {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: bold;
}

/* 頁籤按鈕容器設計 (類似 iOS 的分段控制器) */
.tab-container {
  display: flex;
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 5px;
  margin-bottom: 20px;
  box-shadow: var(--card-shadow);
}
.tab-btn {
  flex: 1;
  padding: 12px 0;
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.6; /* 未選中時稍微變淡 */
}
/* 被選中時的樣式 */
.tab-btn.active {
  background-color: var(--primary-color);
  color: white;
  opacity: 1;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
}

/* 讓切換時有平滑的淡入效果 */
.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>