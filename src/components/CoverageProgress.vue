<script setup>
import { ref } from 'vue'

const props = defineProps({
  coverageData: {
    type: Object,
    required: true
  }
})

// 追蹤目前展開的險種
const activeCategory = ref(null)

const toggleCategory = (category) => {
  activeCategory.value = activeCategory.value === category ? null : category
}

// 實用函數 1：計算進度條視覺寬度 (最高鎖定在 100%，防止破版)
const getBarWidth = (current, target) => {
  if (!target || target === 0) return 0
  const pct = (current / target) * 100
  return pct > 100 ? 100 : pct
}

// 實用函數 2：判斷紅綠燈狀態與百分比
const getStatusInfo = (current, target) => {
  const pct = Math.round((current / target) * 100) || 0
  if (pct > 100) return { color: '#00e676', text: `超標 (${pct}%)`, class: 'good' } // 超標用亮綠色
  if (pct === 100) return { color: '#4caf50', text: `達標 (100%)`, class: 'good' } // 達標用標準綠
  if (pct >= 50) return { color: '#ff9800', text: `注意 (${pct}%)`, class: 'warn' } // 橘色
  return { color: '#f44336', text: `空缺 (${pct}%)`, class: 'danger' } // 紅色
}

// 實用函數 3：動態生成智能解說文案 (取代原本單調的狀態詞)
const getExplanation = (data) => {
  const pct = Math.round((data.current / data.target) * 100) || 0
  if (pct >= 100) {
    return {
      basis: `目前額度【${data.amount}】已達到或超過建議目標。`,
      reason: `達成率 ${pct}%。此區塊保障相當充足，能有效轉移突發狀況帶來的財務衝擊。`,
      action: `維持現狀即可。若有餘裕，建議將預算優先轉移至下方顯示為「紅燈」或「橘燈」的缺口項目。`
    }
  } else if (pct >= 50) {
    return {
      basis: `目前額度【${data.amount}】，距離安全水位仍有一段距離。`,
      reason: `達成率 ${pct}%。雖具備基本保障，但在發生重大事故時，仍需自行負擔部分費用，存在風險缺口。`,
      action: `建議將此列為「次要補強重點」，可考慮利用定期險附加條款來拉高保障額度，拉高整體 CP 值。`
    }
  } else {
    return {
      basis: `目前額度為【${data.amount}】，屬極高財務風險區塊。`,
      reason: `達成率 ${pct}%。幾乎無防護網！若發生事故，將面臨「薪資中斷」或「鉅額醫療費」的雙重打擊，需全額自費。`,
      action: `🚨 強烈建議優先補強此項目！請盡速與業務員討論適合的解決方案，建立最基本的防護底線。`
    }
  }
}
</script>

<template>
  <div class="progress-container">
    <h3>📊 保障達成率智能解析</h3>
    <p class="subtitle">點擊各項目可展開查看【專業判定與建議】</p>

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
              :class="{ 'is-over': getBarWidth(detail.current, detail.target) > 100 }"
              :style="{ 
                width: getBarWidth(detail.current, detail.target) + '%',
                backgroundColor: getStatusInfo(detail.current, detail.target).color 
              }"
            ></div>
            <div class="target-line"></div>
          </div>
          
          <div class="status-badge" :class="getStatusInfo(detail.current, detail.target).class">
            {{ getStatusInfo(detail.current, detail.target).text }}
          </div>
        </div>

        <div v-show="activeCategory === key" class="drawer-content fade-in-down">
          <div class="drawer-inner">
            <div class="info-row">
              <span class="tag tag-basis">判定基礎</span>
              <p>{{ getExplanation(detail).basis }}</p>
            </div>
            <div class="info-row">
              <span class="tag tag-reason">判定依據</span>
              <p>{{ getExplanation(detail).reason }}</p>
            </div>
            <div class="info-row">
              <span class="tag tag-action">建議行動</span>
              <p class="highlight-text">{{ getExplanation(detail).action }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-container { background-color: var(--card-bg); padding: 20px; border-radius: 12px; box-shadow: var(--card-shadow); margin-bottom: 20px; }
h3 { text-align: center; margin: 0 0 5px 0; font-size: 18px; }
.subtitle { text-align: center; color: #888; font-size: 13px; margin-bottom: 20px; }

.bars-wrapper { display: flex; flex-direction: column; gap: 12px; }
.progress-item { border: 1px solid rgba(128, 128, 128, 0.2); border-radius: 8px; padding: 15px; cursor: pointer; transition: all 0.2s ease; background-color: var(--bg-color); }
.progress-item:hover { border-color: #4caf50; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.progress-item.is-active { border-color: var(--text-color); background-color: var(--card-bg); }

.item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.category-name { font-weight: bold; font-size: 16px; }
.amount-text { font-size: 15px; color: var(--text-color); font-weight: bold; }

.item-track-area { display: flex; align-items: center; gap: 15px; }
.track-bg { flex: 1; height: 10px; background-color: rgba(128, 128, 128, 0.2); border-radius: 5px; position: relative; }
.track-fill { height: 100%; border-radius: 5px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
/* 超標時，加上一點斜紋特效增加視覺層次 */
.track-fill.is-over { background-image: linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent); background-size: 1rem 1rem; }
.target-line { position: absolute; top: -2px; bottom: -2px; right: 0; width: 2px; background-color: #888; z-index: 1; }

.status-badge { font-size: 13px; padding: 4px 10px; border-radius: 12px; font-weight: bold; min-width: 75px; text-align: center; }
.status-badge.good { background-color: rgba(76, 175, 80, 0.1); color: #4caf50; border: 1px solid rgba(76, 175, 80, 0.2); }
.status-badge.warn { background-color: rgba(255, 152, 0, 0.1); color: #ff9800; border: 1px solid rgba(255, 152, 0, 0.2); }
.status-badge.danger { background-color: rgba(244, 67, 54, 0.1); color: #f44336; border: 1px solid rgba(244, 67, 54, 0.2); }

.drawer-content { margin-top: 15px; border-top: 1px dashed rgba(128, 128, 128, 0.3); padding-top: 15px; }
.info-row { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
.info-row p { margin: 0; font-size: 14px; line-height: 1.5; color: var(--text-color); }
.tag { display: inline-block; padding: 3px 8px; font-size: 12px; border-radius: 4px; font-weight: bold; width: fit-content; }
.tag-basis { background-color: rgba(128, 128, 128, 0.1); color: #888; }
.tag-reason { background-color: rgba(33, 150, 243, 0.1); color: #2196f3; }
.tag-action { background-color: rgba(76, 175, 80, 0.1); color: #4caf50; }
.highlight-text { font-weight: 500; }

.fade-in-down { animation: fadeInDown 0.3s ease-out; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>