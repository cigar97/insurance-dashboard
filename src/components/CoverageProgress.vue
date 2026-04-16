<script setup>
import { ref } from 'vue'

const props = defineProps({
  coverageData: {
    type: Object,
    required: true
  }
})

// 控制哪一個險種的明細被展開
const activeCategory = ref(null)

const toggleCategory = (category) => {
  activeCategory.value = activeCategory.value === category ? null : category
}

// 實用函數：計算視覺寬度 (最高鎖定在 100%)
const getBarWidth = (current, target) => {
  if (!target || target === 0) return 0
  const percentage = (current / target) * 100
  return percentage > 100 ? 100 : percentage 
}

// 實用函數：根據達成率決定顏色與狀態文字
const getStatusObj = (current, target) => {
  const percentage = (current / target) * 100
  if (percentage >= 100) return { color: '#4caf50', text: percentage > 100 ? '超標' : '達標', class: 'good' }
  if (percentage >= 50) return { color: '#ff9800', text: '注意', class: 'warn' }
  return { color: '#f44336', text: '空缺', class: 'danger' }
}
</script>

<template>
  <div class="progress-container">
    <h3>📊 各項保障達成率</h3>
    <p class="subtitle">點擊各項目可查看理賠明細</p>

    <div class="bars-wrapper">
      <div 
        v-for="(detail, key) in coverageData" 
        :key="key" 
        class="progress-item"
        :class="{ 'is-active': activeCategory === key }"
        @click="toggleCategory(key)"
      >
        <div class="item-header">
          <span class="category-name">{{ key }}</span>
          <span class="amount-text">{{ detail.amount }}</span>
        </div>

        <div class="item-track-area">
          <div class="track-bg">
            <div 
              class="track-fill" 
              :style="{ 
                width: getBarWidth(detail.current, detail.target) + '%',
                backgroundColor: getStatusObj(detail.current, detail.target).color 
              }"
            ></div>
          </div>
          
          <div class="status-badge" :class="getStatusObj(detail.current, detail.target).class">
            {{ getStatusObj(detail.current, detail.target).text }} 
            ({{ Math.round((detail.current / detail.target) * 100) }}%)
          </div>
        </div>

        <div v-show="activeCategory === key" class="drawer-content fade-in-down">
          <div class="drawer-inner">
            <p><strong>系統判定狀態：</strong>{{ detail.status }}</p>
            <p class="ai-suggestion">這是一個適合放 AI 條款摘要或是給客戶建議的區塊，幫助客戶理解為什麼這個項目會顯示{{ getStatusObj(detail.current, detail.target).text }}。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  margin-bottom: 20px;
}
h3 { text-align: center; margin: 0 0 5px 0; }
.subtitle { text-align: center; color: #888; font-size: 13px; margin-bottom: 20px; }

.bars-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.progress-item {
  border: 1px solid rgba(128, 128, 128, 0.2);
  border-radius: 8px;
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--bg-color);
}
.progress-item:hover {
  border-color: #4caf50;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.progress-item.is-active {
  border-color: var(--text-color);
  background-color: var(--card-bg);
}

/* 險種名稱與金額 */
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.category-name { font-weight: bold; font-size: 15px; }
.amount-text { font-size: 14px; color: var(--text-color); font-weight: bold; }

/* 進度條軌道區 */
.item-track-area {
  display: flex;
  align-items: center;
  gap: 10px;
}
.track-bg {
  flex: 1;
  height: 8px;
  background-color: rgba(128, 128, 128, 0.2);
  border-radius: 4px;
  overflow: hidden;
}
.track-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 徽章設計 */
.status-badge {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: bold;
  min-width: 65px;
  text-align: center;
}
.status-badge.good { background-color: rgba(76, 175, 80, 0.1); color: #4caf50; }
.status-badge.warn { background-color: rgba(255, 152, 0, 0.1); color: #ff9800; }
.status-badge.danger { background-color: rgba(244, 67, 54, 0.1); color: #f44336; }

/* 展開明細的抽屜 */
.drawer-content {
  margin-top: 12px;
  border-top: 1px dashed rgba(128, 128, 128, 0.3);
  padding-top: 12px;
}
.drawer-inner p { margin: 0 0 8px 0; font-size: 14px; color: var(--text-color); }
.ai-suggestion { color: #888 !important; line-height: 1.5; }

.fade-in-down { animation: fadeInDown 0.3s ease-out; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>