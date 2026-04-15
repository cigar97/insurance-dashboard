<script setup>
// 接收從 App.vue 傳進來的狀態與「真實客戶資料」
defineProps({
  currentView: {
    type: String,
    required: true
  },
  clientData: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="header">
    <div class="header-title">
      <h2>👤 客戶：{{ clientData.name }} ({{ clientData.age }}歲)</h2>
      
      <span v-if="currentView === 'concept'" class="status-badge concept-badge fade-in">
        💡 觀念溝通階段
      </span>
      
      <span v-if="currentView === 'dashboard'" class="status-badge premium-badge fade-in">
        💰 年繳保費：{{ clientData.premium }} 元
      </span>
    </div>
  </div>
</template>

<style scoped>
.header {
  padding: 15px 20px;
  background-color: var(--card-bg);
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: var(--card-shadow);
  display: flex;
  align-items: center;
}
.header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  flex-wrap: wrap; /* 螢幕太小時自動換行 */
  gap: 10px;
}
h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}
/* 觀念階段的標籤樣式 (柔和的灰色) */
.concept-badge {
  background-color: rgba(128, 128, 128, 0.1);
  color: #888;
}
/* 保費的標籤樣式 (強調的綠色) */
.premium-badge {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

/* 加上淡入動畫，讓切換時更滑順 */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>