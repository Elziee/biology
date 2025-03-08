import OpenAI from 'openai';
import 'dotenv/config';

async function callOpenAIVisionAPI(base64Image, prompt) {
    const API_KEY = process.env.OPENAI_API_KEY;
    const API_URL = "https://api.openai.com/v1/vision";  // 使用 gpt-4o-mini 模型的端點

    try {
        console.log("正在使用 gpt-4o-mini 模型分析圖片...");
        
        if (!API_KEY) {
            throw new Error('未設置 OpenAI API Key，請在 .env 檔案中設置 OPENAI_API_KEY');
        }

        // 檢查 base64Image 是否已經包含 data URI 前綴
        const imageUrl = base64Image.startsWith('data:') 
            ? base64Image 
            : `data:image/jpeg;base64,${base64Image}`;

        // 準備 API 請求
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "你是一個營養分析助手，請分析圖片中的食物並提供詳細的營養資訊。回應必須是 JSON 格式。"
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt || "請分析這張食物圖片的營養成分，並提供詳細的營養分析報告。請以 JSON 格式回應，包含以下資訊：{ 食物名稱: string, 主要成份: Array<{ 名稱: string, 重量: number, 熱量: number, 營養成分: { 蛋白質: number, 碳水化合物: number, 脂肪: number, 膳食纖維: number, 鈉: number }, 營養分析: string }>, 總熱量: number, 營養價值標籤: string[], 飲食建議: string[] }"
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageUrl
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 2000,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error Response:", errorText);
            throw new Error(`API request failed: ${errorText}`);
        }

        const responseText = await response.text();
        console.log("Raw API Response:", responseText);

        try {
            const result = JSON.parse(responseText);
            if (!result.choices || !result.choices[0]?.message?.content) {
                console.error("Invalid API Response Structure:", result);
                throw new Error('Invalid response format from API');
            }

            const content = result.choices[0].message.content;
            console.log("Message content:", content);

            try {
                const parsedContent = JSON.parse(content);
                console.log("成功解析 gpt-4o-mini 模型的回應");
                return parsedContent;
            } catch (error) {
                console.error("解析 API 回應時發生錯誤:", error);
                throw new Error(`無法解析 API 回應: ${error.message}`);
            }
        } catch (error) {
            console.error("解析 API 回應時發生錯誤:", error);
            throw new Error(`無法解析 API 回應: ${error.message}`);
        }
    } catch (error) {
        console.error("OpenAI API Error:", error);
        throw error;
    }
}

export { callOpenAIVisionAPI };
