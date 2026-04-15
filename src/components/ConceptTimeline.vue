<script setup>
import { ref } from 'vue'

const activeStep = ref(1)

const steps = [
  {
    id: 1,
    title: '確診當下',
    subtitle: '住院前',
    icon: '🚨',
    risk: '突如其來的噩耗、可能面臨留職停薪、初期需要一大筆錢安頓家庭與選擇自費療法。',
    strategy: '大筆一次金 (救急與生活週轉)',
    tools: '重大傷病險、癌症一次金'
  },
  {
    id: 2,
    title: '治療期間',
    subtitle: '住院中',
    icon: '🏥',
    risk: '健保不給付的高價標靶藥物、達文西微創手術費用、升級單人病房的差額。',
    strategy: '實支實付 / 手術定額 (解決醫療帳單)',
    tools: '醫療實支實付、住院日額'
  },
  {
    id: 3,
    title: '出院療養',
    subtitle: '出院後',
    icon: '🏠',
    risk: '出院才是真正花錢的開始。若因病導致無法重返職場，每個月的看護費、尿布輔具等長期消耗。',
    strategy: '持續性月給付 (填補薪水與看護費)',
    tools: '失能險、長照險'
  }
]
</script>

<template>
  <div class="timeline-container">
    <h3 class="section-title">💡 醫療財務防護網觀念</h3>
    
    <div class="timeline-tabs">
      <button 
        v-for="step in steps" 
        :key="step.id"
        :class="['tab-btn', { active: activeStep === step.id }]"
        @click="activeStep = step.id"
      >
        <div class="step-num">{{ step.id }}</div>
        <div class="step-text">
          <span class="title">{{ step.title }}</span>
          <span class="subtitle">{{ step.subtitle }}</span>
        </div>
      </button>
    </div>

    <div class="content-card">
      <transition name="fade" mode="out-in">
        <div :key="activeStep" class="card-inner">
          <div class="card-header">
            <span class="card-icon">{{ steps[activeStep - 1].icon }}</span>
            <h4>{{ steps[activeStep - 1].title }}階段的挑戰</h4>
          </div>
          
          <div class="info-group">
            <div class="label warning">面臨風險</div>
            <p>{{ steps[activeStep - 1].risk }}</p>
          </div>
          
          <div class="info-group">
            <div class="label primary">核心防禦策略</div>
            <p class="highlight">{{ steps[activeStep - 1].strategy }}</p>
          </div>
          
          <div class="info-group">
            <div class="label tools">對應規劃工具</div>
            <p>{{ steps[activeStep - 1].tools }}</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.timeline-container {
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  margin-bottom: 20px;
}
.section-title {
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
}

/* 時間軸按鈕設計 */
.timeline-tabs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
}
/* 畫一條連接線 */
.timeline-tabs::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 10%;
  right: 10%;
  height: 2px;
  background-color: rgba(128, 128, 128, 0.2);
  z-index: 0;
}
.tab-btn {
  flex: 1;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  opacity: 0.5;
  transition: all 0.3s ease;
}
.tab-btn.active {
  opacity: 1;
}
.step-num {
  width: 32px;
  height: 32px;
  background-color: var(--card-bg);
  border: 2px solid #888;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 8px;
  transition: all 0.3s ease;
}
.tab-btn.active .step-num {
  border-color: #4caf50;
  background-color: #4caf50;
  color: white;
}
.step-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.step-text .title {
  font-weight: bold;
  font-size: 14px;
  color: var(--text-color);
}
.step-text .subtitle {
  font-size: 12px;
  color: #888;
}

/* 卡片內容設計 */
.content-card {
  background-color: var(--bg-color);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid rgba(128, 128, 128, 0.1);
}
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.1);
  padding-bottom: 10px;
}
.card-header h4 {
  margin: 0;
  font-size: 18px;
  color: var(--text-color);
}
.card-icon {
  font-size: 24px;
}
.info-group {
  margin-bottom: 15px;
}
.info-group p {
  margin: 5px 0 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--text-color);
}
.p.highlight {
  font-weight: bold;
  color: #4caf50;
}
.label {
  display: inline-block;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
  font-weight: bold;
}
.label.warning { background-color: rgba(244, 67, 54, 0.1); color: #f44336; }
.label.primary { background-color: rgba(76, 175, 80, 0.1); color: #4caf50; }
.label.tools { background-color: rgba(33, 150, 243, 0.1); color: #2196f3; }

/* 漸變動畫設定 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>