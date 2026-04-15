export default async function handler(req, res) {
  // 確保只有 POST 請求可以進來
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許 POST 請求' });
  }

  try {
    const { base64Data } = req.body;
    
    // 💡 核心安全機制：從 Vercel 環境變數讀取金鑰，絕對不會外洩在網頁上
    const apiKey = process.env.GEMINI_API_KEY; 

    if (!apiKey) {
      return res.status(500).json({ error: '伺服器尚未設定 API Key' });
    }

    const promptText = `
      你是一個專業的台灣保險理賠分析師。
      請分析這份 PDF 保險建議書，找出被保險人姓名、年齡、年繳保費，並評估六大保障的狀態。
      請嚴格輸出為 JSON 格式，絕對不要加上任何 Markdown 標記 (如 \`\`\`json)。
      結構必須如下：
      {
        "client": { "name": "字串", "age": 數字, "premium": "字串(如 32,550)" },
        "coverage": {
          "重大傷病": { "current": 數字, "target": 100, "amount": "描述", "status": "充足 / 注意 / 空缺" },
          "意外傷害": { "current": 數字, "target": 100, "amount": "描述", "status": "狀態" },
          "醫療實支": { "current": 數字, "target": 100, "amount": "描述", "status": "狀態" },
          "癌症一次金": { "current": 數字, "target": 100, "amount": "描述", "status": "狀態" },
          "失能長照": { "current": 數字, "target": 100, "amount": "描述", "status": "狀態" },
          "家庭壽險": { "current": 數字, "target": 100, "amount": "描述", "status": "狀態" }
        }
      }
    `;

    // 呼叫 Gemini 2.5 Flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptText },
            { inline_data: { mime_type: "application/pdf", data: base64Data } }
          ]
        }],
        generationConfig: { response_mime_type: "application/json" }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || 'Gemini 請求失敗');
    }

    // 處理回傳的 JSON
    let jsonString = result.candidates[0].content.parts[0].text;
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(jsonString);

    // 將整理好的資料回傳給前端網頁
    return res.status(200).json(parsedData);

  } catch (error) {
    console.error('中繼站解析失敗:', error);
    return res.status(500).json({ error: error.message });
  }
}