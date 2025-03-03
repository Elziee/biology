// 全局變量
let userData = {
    profile: null,
    foodData: [],
    dailyNutrition: {
        calories: 0,
        carbs: 0,
        fat: 0,
        protein: 0
    }
};

// 頁面切換
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = pageId === 'home' ? 'flex' : 'block';
}

// 初始化顯示主頁
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    initHealthChart();
});

// 個人資料表單處理
document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const profile = {
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        height: parseFloat(document.getElementById('height').value),
        weight: parseFloat(document.getElementById('weight').value),
        activity: parseInt(document.getElementById('activity').value)
    };
    
    userData.profile = profile;
    
    // 計算BMR和TDEE
    const bmr = calculateBMR(profile);
    const tdee = calculateTDEE(bmr, profile.activity);
    
    // 顯示結果
    document.getElementById('calculationResults').innerHTML = `
        <h3>計算結果</h3>
        <p>基礎代謝率 (BMR): ${bmr.toFixed(2)} 大卡/天</p>
        <p>每日總能量消耗 (TDEE): ${tdee.toFixed(2)} 大卡/天</p>
    `;
    
    // 保存到localStorage
    saveUserData();
});

// 計算BMR (基礎代謝率)
function calculateBMR(profile) {
    if (profile.gender === 'male') {
        return 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
        return 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }
}

// 計算TDEE (每日總能量消耗)
function calculateTDEE(bmr, activityLevel) {
    const activityFactors = {
        1: 1.2,  // 久座不動
        2: 1.375,  // 輕度活動
        3: 1.55,  // 中度活動
        4: 1.725,  // 重度活動
        5: 1.9  // 極重度運動
    };
    return bmr * activityFactors[activityLevel];
}

// 食物分析功能
function analyzeFoodImage() {
    const fileInput = document.getElementById('foodImage');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('請先選擇食物圖片');
        return;
    }
    
    // 模擬AI分析結果
    const mockAnalysis = {
        name: '範例食物',
        calories: 300,
        carbs: 40,
        fat: 10,
        protein: 15
    };
    
    // 更新當日營養攝取
    userData.dailyNutrition.calories += mockAnalysis.calories;
    userData.dailyNutrition.carbs += mockAnalysis.carbs;
    userData.dailyNutrition.fat += mockAnalysis.fat;
    userData.dailyNutrition.protein += mockAnalysis.protein;
    
    // 記錄食物數據
    userData.foodData.push({
        ...mockAnalysis,
        type: document.getElementById('mealType').value,
        timestamp: new Date().toISOString()
    });
    
    // 更新顯示
    updateNutritionDisplay();
    updateHealthChart();
    
    // 顯示分析結果
    document.getElementById('analysisResult').innerHTML = `
        <h3>食物分析結果</h3>
        <p>食物名稱: ${mockAnalysis.name}</p>
        <p>熱量: ${mockAnalysis.calories} 大卡</p>
        <p>碳水化合物: ${mockAnalysis.carbs}g</p>
        <p>脂肪: ${mockAnalysis.fat}g</p>
        <p>蛋白質: ${mockAnalysis.protein}g</p>
    `;
    
    // 保存數據
    saveUserData();
}

// 更新營養攝取顯示
function updateNutritionDisplay() {
    document.getElementById('totalCalories').textContent = userData.dailyNutrition.calories;
    document.getElementById('totalCarbs').textContent = userData.dailyNutrition.carbs;
    document.getElementById('totalFat').textContent = userData.dailyNutrition.fat;
    document.getElementById('totalProtein').textContent = userData.dailyNutrition.protein;
}

// 健康數據圖表
let healthChart;

function initHealthChart() {
    const ctx = document.getElementById('healthChart').getContext('2d');
    healthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['碳水化合物', '蛋白質', '脂肪', '膳食纖維', '維生素C', '鈣質', 'TDEE'],
            datasets: [{
                label: '每日營養攝取量 (克)',
                data: [275, 60, 55, 25, 0.09, 1.2, null],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(0, 0, 0, 0)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(0, 0, 0, 0)'
                ],
                borderWidth: 1,
                yAxisID: 'y'
            }, {
                label: 'TDEE (大卡)',
                data: [null, null, null, null, null, null, 2000],
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '克 (g)'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '大卡 (kcal)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: '每日營養素攝取量與能量消耗追蹤'
                }
            }
        }
    });
}

function updateHealthChart() {
    if (!healthChart) return;
    
    // 更新圖表數據
    const today = new Date().toLocaleDateString();
    
    if (!healthChart.data.labels.includes(today)) {
        healthChart.data.labels.push(today);
        
        const tdee = userData.profile ? 
            calculateTDEE(calculateBMR(userData.profile), userData.profile.activity) : 0;
            
        healthChart.data.datasets[0].data.push(tdee);
        healthChart.data.datasets[1].data.push(userData.dailyNutrition.calories);
        
        healthChart.update();
    }
}

// 數據持久化
function saveUserData() {
    localStorage.setItem('nutritionAppData', JSON.stringify(userData));
}

function loadUserData() {
    const saved = localStorage.getItem('nutritionAppData');
    if (saved) {
        userData = JSON.parse(saved);
        updateNutritionDisplay();
        updateHealthChart();
    }
}

// 載入保存的數據
loadUserData();
