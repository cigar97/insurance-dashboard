<script setup>
import { ref } from 'vue'

// 定義一個變數來儲存「當前的計算結果」
const currentResult = ref({
  title: '預估理賠：請點擊上方按鈕',
  amount: '---',
  detail: '點擊不同情境，系統將自動從葉先生的保單中抓取對應理賠金。',
  isWarning: false // 用來判斷是否要亮紅燈警告
})

// 定義點擊按鈕後執行的計算邏輯
const calculate = (scenario) => {
  if (scenario === '盲腸炎') {
    currentResult.value = {
      title: '🏥 盲腸炎 (住院5天 + 微創手術)',
      amount: '最高約 11.5 萬元',
      detail: '病房費理賠 15,000元 (實支+定額)。手術及雜費啟動實支實付，最高限額 10 萬元內核實理賠。',
      isWarning: false
    }
  } else if (scenario === '車禍骨折') {
    currentResult.value = {
      title: '💥 車禍骨折 (無住院, 門診復健)',
      amount: '最高 30,000 元',
      detail: '啟動「意外醫療實支實付」，每次意外最高理賠 3 萬元。另有骨折未住院津貼依比例給付。',
      isWarning: false
    }
  } else if (scenario === '疾病失能') {
    currentResult.value = {
      title: '⚠️ 嚴重中風導致失能 (無法工作)',
      amount: '0 元 / 每月',
      detail: '最大風險缺口！現有保單僅理賠「意外」失能，因「疾病」導致的長期照護將無任何收入補償，需全額自費。',
      isWarning: true // 設定為警告狀態
    }
  } else if (scenario === '初期原位癌') {
    currentResult.value = {
      title: '🎗️ 確診初期原位癌 (門診切除)',
      amount: '約 13 萬元',
      detail: '初次罹患低侵襲性癌症給付 10 萬元，加上癌症門診手術 3 萬元。',
      isWarning: false
    }
  } else if (scenario === '嚴重燒燙傷') {
    currentResult.value = {
      title: '🔥 意外嚴重燒燙傷 (住院20天)',
      amount: '超過 60 萬元',
      detail: '啟動重大燒燙傷一次金 50 萬，加上燒燙傷病房日額 (每日加計) 與意外實支實付。',
      isWarning: false
    }
  }
}
</script>

<template>
  <div class="scenario-area">
    <h3>🔍 模擬理賠情境</h3>
    
    <div class="btn-group">
      <button @click="calculate('盲腸炎')">🏥 盲腸炎</button>
      <button @click="calculate('車禍骨折')">💥 車禍骨折</button>
      <button @click="calculate('疾病失能')">⚠️ 疾病失能</button>
      <button @click="calculate('初期原位癌')">🎗️ 初期原位癌</button>
      <button @click="calculate('嚴重燒燙傷')">🔥 嚴重燒燙傷</button>
    </div>

    <div class="result" :class="{ 'warning-bg': currentResult.isWarning }">
      <h4 :class="{ 'warning-text': currentResult.isWarning }">{{ currentResult.title }}</h4>
      <div class="amount" :class="{ 'warning-text': currentResult.isWarning }">{{ currentResult.amount }}</div>
      <p class="detail">{{ currentResult.detail }}</p>
    </div>
  </div>
</template>

<style scoped>
.scenario-area {
  padding: 20px;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
}
.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}
button {
  flex: 1 1 calc(33% - 8px); /* 讓按鈕排成漂亮的網格 */
  padding: 8px 10px;
  cursor: pointer;
  background-color: transparent;
  color: var(--text-color);
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}
button:hover {
  background-color: rgba(76, 175, 80, 0.1);
  border-color: #4caf50;
}
.result {
  padding: 15px;
  background-color: var(--bg-color); /* 預設底色 */
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}
/* 警告狀態的樣式 (紅燈缺口) */
.result.warning-bg {
  background-color: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
}
.result h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
}
.amount {
  font-size: 24px;
  font-weight: bold;
  color: #4caf50; /* 預設金額為綠色 */
  margin-bottom: 10px;
}
/* 警告狀態的文字 (紅色) */
.warning-text {
  color: #f44336 !important; 
}
.detail {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #888;
}
</style>