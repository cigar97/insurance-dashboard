<script setup>
import { ref } from 'vue'

const emit = defineEmits(['data-loaded'])
const isDragging = ref(false)
const isProcessing = ref(false)
const uploadMessage = ref('點擊或拖曳 PDF 建議書至此處')

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = error => reject(error)
  })
}

const handleFileUpload = async (event) => {
  const file = event.target.files ? event.target.files[0] : event.dataTransfer.files[0]
  if (!file) return
  if (file.type !== 'application/pdf') return alert('請上傳 PDF 格式的檔案！')

  isProcessing.value = true
  uploadMessage.value = `系統正在解析 ${file.name}，請稍候...`

  try {
    const base64Data = await fileToBase64(file)

    // 💡 核心改變：我們現在是把資料傳給「我們自己的中繼站」，而不是直接傳給 Google
    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Data })
    })

    const result = await response.json()

    if (!response.ok) throw new Error(result.error)

    isProcessing.value = false
    emit('data-loaded', result) // result 現在已經是乾淨的 JSON 了

  } catch (error) {
    alert(`解析失敗：${error.message}`)
    isProcessing.value = false
    uploadMessage.value = '點擊或拖曳 PDF 建議書至此處'
  }
}

const onDragOver = (e) => { e.preventDefault(); isDragging.value = true }
const onDragLeave = (e) => { e.preventDefault(); isDragging.value = false }
const onDrop = (e) => { e.preventDefault(); isDragging.value = false; handleFileUpload(e) }
</script>

<template>
  <div class="importer-container fade-in">
    <h2>📄 智能保單解析系統</h2>
    <p class="desc">上傳建議書，系統將自動辨識並產生視覺化儀表板</p>
    
    <div 
      class="upload-area" 
      :class="{ 'is-dragging': isDragging, 'is-processing': isProcessing }"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click="!isProcessing && $refs.fileInput.click()"
    >
      <input type="file" ref="fileInput" accept=".pdf" style="display: none" @change="handleFileUpload">
      <div v-if="!isProcessing">
        <div class="upload-icon">📁</div>
        <div class="upload-text">{{ uploadMessage }}</div>
      </div>
      <div v-else class="processing-state">
        <div class="spinner"></div>
        <div class="upload-text">{{ uploadMessage }}</div>
        <div class="sub-text">大約需要 5~10 秒，請勿關閉視窗...</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 樣式與之前完全一樣，只是移除了 API Key 區塊的 CSS */
.importer-container { background-color: var(--card-bg); padding: 30px 20px; border-radius: 12px; box-shadow: var(--card-shadow); text-align: center; margin-top: 20px; }
.desc { color: #888; margin-bottom: 20px; }
.upload-area { border: 2px dashed rgba(128, 128, 128, 0.4); border-radius: 12px; padding: 40px 20px; cursor: pointer; transition: all 0.3s ease; background-color: var(--bg-color); }
.upload-area:hover { border-color: #4caf50; background-color: rgba(76, 175, 80, 0.05); }
.upload-area.is-dragging { border-color: #4caf50; background-color: rgba(76, 175, 80, 0.1); transform: scale(1.02); }
.upload-area.is-processing { cursor: not-allowed; border-color: transparent; background-color: rgba(128, 128, 128, 0.05); }
.upload-icon { font-size: 48px; margin-bottom: 15px; }
.upload-text { font-size: 16px; font-weight: bold; color: var(--text-color); }
.spinner { width: 40px; height: 40px; border: 4px solid rgba(76, 175, 80, 0.2); border-top-color: #4caf50; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px auto; }
@keyframes spin { to { transform: rotate(360deg); } }
.sub-text { margin-top: 10px; font-size: 13px; color: #888; }
</style>