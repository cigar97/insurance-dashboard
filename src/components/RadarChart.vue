<script setup>
import { ref, computed } from 'vue'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import { Radar } from 'vue-chartjs'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

// 接收從 AI 解析後傳進來的六大保障數據
const props = defineProps({
  coverageData: {
    type: Object,
    required: true
  }
})

// 🟢 動態計算雷達圖的數值
const chartData = computed(() => {
  return {
    labels: ['重大傷病', '意外傷害', '醫療實支', '癌症一次金', '失能長照', '家庭壽險'],
    datasets: [
      {
        label: '現有保障 (%)',
        backgroundColor: 'rgba(76, 175, 80, 0.4)',
        borderColor: 'rgba(76, 175, 80, 1)',
        pointBackgroundColor: 'rgba(76, 175, 80, 1)',
        // 自動從傳進來的資料抓取 percentage
        data: [
          props.coverageData['重大傷病']?.current || 0,
          props.coverageData['意外傷害']?.current || 0,
          props.coverageData['醫療實支']?.current || 0,
          props.coverageData['癌症一次金']?.current || 0,
          props.coverageData['失能長照']?.current || 0,
          props.coverageData['家庭壽險']?.current || 0
        ]
      },
      {
        label: '建議目標 (%)',
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        borderColor: 'rgba(244, 67, 54, 1)',
        pointBackgroundColor: 'rgba(244, 67, 54, 1)',
        data: [100, 100, 100, 100, 100, 100]
      }
    ]
  }
})

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#888' } } },
  scales: {
    r: {
      min: 0, max: 100,
      ticks: { stepSize: 20, backdropColor: 'transparent', color: '#888' },
      grid: { color: 'rgba(128, 128, 128, 0.2)' },
      angleLines: { color: 'rgba(128, 128, 128, 0.2)' },
      pointLabels: { color: '#888', font: { size: 14 } }
    }
  }
}

const activeCategory = ref(null)
const toggleCategory = (category) => {
  activeCategory.value = activeCategory.value === category ? null : category
}
</script>

<template>
  <div class="chart-container">
    <h3>📊 六大保障缺口分析</h3>
    
    <div class="radar-wrapper">
      <Radar :data="chartData" :options="chartOptions" />
    </div>

    <div class="category-tags">
      <button 
        v-for="(detail, key) in coverageData" 
        :key="key"
        class="tag-btn"
        :class="{ active: activeCategory === key }"
        @click="toggleCategory(key)"
      >
        {{ key }}
      </button>
    </div>

    <div v-if="activeCategory && coverageData[activeCategory]" class="detail-drawer fade-in-up">
      <div class="drawer-header">
        <h4>{{ activeCategory }} 保障狀態</h4>
        <span class="status" :class="coverageData[activeCategory].status === '充足' || coverageData[activeCategory].status === '達標' ? 'good' : (coverageData[activeCategory].status === '注意' ? 'warn' : 'danger')">
          {{ coverageData[activeCategory].status }}
        </span>
      </div>
      <div class="detail-content">
        <strong>目前額度：</strong> {{ coverageData[activeCategory].amount }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  margin-bottom: 20px;
  overflow: hidden; /* 防止抽屜滑出時破版 */
}
h3 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 15px;
}
.radar-wrapper {
  position: relative;
  height: 300px; 
  width: 100%;
  margin-bottom: 20px;
}

/* 標籤群組設計 */
.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 10px;
}
.tag-btn {
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid rgba(128, 128, 128, 0.3);
  background: transparent;
  color: var(--text-color);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.tag-btn:hover {
  background: rgba(128, 128, 128, 0.05);
}
.tag-btn.active {
  background: var(--text-color);
  color: var(--bg-color);
  border-color: var(--text-color);
  font-weight: bold;
}

/* 明細抽屜設計 */
.detail-drawer {
  background-color: rgba(128, 128, 128, 0.05);
  border: 1px solid rgba(128, 128, 128, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
}
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px dashed rgba(128, 128, 128, 0.3);
  padding-bottom: 8px;
}
.drawer-header h4 {
  margin: 0;
  font-size: 16px;
  color: var(--text-color);
}
.status {
  font-size: 14px;
  font-weight: bold;
}
.status.good { color: #4caf50; }
.status.warn { color: #ff9800; }
.status.danger { color: #f44336; }

.detail-list {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.6;
  color: #888;
}
.detail-list li {
  margin-bottom: 6px;
}

/* 向上滑入動畫 */
.fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>