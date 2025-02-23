document.addEventListener('DOMContentLoaded', function() {
    const uploadButton = document.getElementById('uploadButton');
    const analyzeButton = document.getElementById('analyzeButton');
    const foodImage = document.getElementById('foodImage');
    const mealType = document.getElementById('mealType');
    
    let currentImage = null;

    uploadButton.addEventListener('click', function() {
        foodImage.click();
    });

    foodImage.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentImage = e.target.result;
                document.getElementById('analysisResult').innerHTML = '圖片已上傳，請點擊分析按鈕進行分析';
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    analyzeButton.addEventListener('click', async function() {
        if (!currentImage) {
            alert('請先上傳食物圖片');
            return;
        }

        try {
            document.getElementById('analysisResult').innerHTML = '分析中...';
            
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: currentImage,
                    mealType: mealType.value
                })
            });

            if (!response.ok) {
                throw new Error('分析失敗');
            }

            const data = await response.json();
            displayAnalysisResult(data);
            saveNutritionData(data);

        } catch (error) {
            document.getElementById('analysisResult').innerHTML = '分析失敗：' + error.message;
        }
    });
});

function displayAnalysisResult(data) {
    const resultDiv = document.getElementById('analysisResult');
    const suggestionDiv = document.getElementById('aiSuggestion');

    let html = `
        <h5>${data.食物名稱}</h5>
        <p>總熱量: ${data.總熱量} 大卡</p>
        <h6>主要成份:</h6>
        <ul>
    `;

    data.主要成份.forEach(item => {
        html += `
            <li>
                <strong>${item.名稱}</strong> (${item.重量}g)
                <ul>
                    <li>熱量: ${item.熱量} 大卡</li>
                    <li>蛋白質: ${item.營養成分.蛋白質}g</li>
                    <li>碳水化合物: ${item.營養成分.碳水化合物}g</li>
                    <li>脂肪: ${item.營養成分.脂肪}g</li>
                    <li>膳食纖維: ${item.營養成分.膳食纖維}g</li>
                    <li>鈉: ${item.營養成分.鈉}mg</li>
                </ul>
                <p><small>${item.營養分析}</small></p>
            </li>
        `;
    });

    html += `</ul>
        <div class="mt-3">
            <h6>營養標籤:</h6>
            <div class="d-flex flex-wrap gap-2">
    `;

    data.營養價值標籤.forEach(tag => {
        html += `<span class="badge bg-info">${tag}</span>`;
    });

    html += `</div></div>`;
    resultDiv.innerHTML = html;

    let suggestionHtml = `
        <h6>飲食建議:</h6>
        <ul>
    `;
    data.飲食建議.forEach(suggestion => {
        suggestionHtml += `<li>${suggestion}</li>`;
    });
    suggestionHtml += `</ul>`;
    suggestionDiv.innerHTML = suggestionHtml;
}

function saveNutritionData(data) {
    const mealType = document.getElementById('mealType').value;
    const date = new Date().toISOString().split('T')[0];
    
    // Get existing data for the day
    let dailyData = JSON.parse(localStorage.getItem(`nutrition_${date}`) || '{}');
    
    if (!dailyData[mealType]) {
        dailyData[mealType] = [];
    }
    
    // Add new food data
    dailyData[mealType].push({
        time: new Date().toISOString(),
        ...data
    });
    
    // Save back to localStorage
    localStorage.setItem(`nutrition_${date}`, JSON.stringify(dailyData));
}
