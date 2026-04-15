<script setup>
import { ref } from 'vue'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'vue-chartjs'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const chartData = {
  labels: ['重大傷病', '意外傷害', '醫療實支', '癌症一次金', '失能長照', '家庭壽險'],
  datasets: [
    {
      label: '現有保障 (%)',
      backgroundColor: 'rgba(76, 175, 80, 0.4)',
      borderColor: 'rgba(76, 175, 80, 1)',
      pointBackgroundColor: 'rgba(76, 175, 80, 1)',
      data: [100, 100, 50, 50, 0, 0]
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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
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

// 追蹤目前點擊的險種
const activeCategory = ref(null)

// 建立保單真實細節資料庫 (解析自您上傳的全球人壽建議書)
const policyDetails = {
  '重大傷病': {
    amount: '總計 200 萬',
    status: '充足',
    items: [
      '醫卡讚85定期健康保險 (DCE30)：20萬',
      '醫卡讚一年期健康附約 (XDE00)：180萬',
      '💡 備註：若為特定重大傷病(如嚴重燒燙傷、器官移植等)，額外多給付 40萬。'
    ]
  },
  '意外傷害': {
    amount: '身故 300 萬 / 實支 3 萬',
    status: '達標',
    items: [
      '御守傷害附約 (XAB00)：身故 200萬 / 重大燒燙傷 50萬',
      '臻平安傷害附約 (XAN00)：身故 100萬',
      '新傷害醫療實支實付 (XMBN00)：每次最高 3萬',
      '💡 備註：意外住院每日 1,500元。'
    ]
  },
  '醫療實支': {
    amount: '雜費 10 萬 / 病房 3,000 元',
    status: '注意',
    items: [
      '實分鑫安醫療實支 (XHD00)：雜費 10萬 / 病房 1,000元',
      '住院醫療定額型 (MIR00)：病房 2,000元',
      '全心全意自負額 (XHO00)：提供超過 10萬後，最高額外 24萬的雜費限額補充。',
      '💡 提醒：微創手術(如達文西)雜費若在 10萬內需自行吸收部分，建議升級雙實支。'
    ]
  },
  '癌症一次金': {
    amount: '重度 100 萬 / 標靶 30 萬',
    status: '注意',
    items: [
      '臻心一意防癌一次金 (XCF00)：侵襲性癌症 100萬 / 低侵襲性 10萬',
      '臻心全意防癌醫療 (XCG00)：標靶治療終身限額 30萬 / 癌症住院 3,000元/日',
      '💡 提醒：若罹患特定部位癌症(如肺癌、肝癌等)可再多給付 50萬。'
    ]
  },
  '失能長照': {
    amount: '0 元 / 每月',
    status: '空缺',
    items: [
      '目前僅有「意外失能」一次金 (最高300萬)。',
      '臻鑫久久豁免保費 (XWB00)：1-8級失能可豁免後續保費。',
      '🚨 嚴重缺口：無「疾病導致」的失能或長照月給付金，無法填補長期中斷的薪資。'
    ]
  },
  '家庭壽險': {
    amount: '0 元',
    status: '空缺',
    items: [
      '本專案未規劃純壽險額度。',
      '🚨 嚴重缺口：若有車貸、信貸或奉養父母責任，身故後無留愛家人的緩衝金。'
    ]
  }
}

// 點擊標籤的切換邏輯
const toggleCategory = (category) => {
  if (activeCategory.value === category) {
    activeCategory.value = null // 再點一次可收起
  } else {
    activeCategory.value = category
  }
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
        v-for="(detail, key) in policyDetails" 
        :key="key"
        class="tag-btn"
        :class="{ active: activeCategory === key }"
        @click="toggleCategory(key)"
      >
        {{ key }}
      </button>
    </div>

    <div v-if="activeCategory" class="detail-drawer fade-in-up">
      <div class="drawer-header">
        <h4>{{ activeCategory }} 保障明細</h4>
        <span class="status" :class="policyDetails[activeCategory].status === '充足' || policyDetails[activeCategory].status === '達標' ? 'good' : (policyDetails[activeCategory].status === '注意' ? 'warn' : 'danger')">
          {{ policyDetails[activeCategory].amount }}
        </span>
      </div>
      <ul class="detail-list">
        <li v-for="(item, index) in policyDetails[activeCategory].items" :key="index">
          {{ item }}
        </li>
      </ul>
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