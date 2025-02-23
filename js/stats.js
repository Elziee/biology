document.addEventListener('DOMContentLoaded', function() {
    updateDailyNutrition();
    initializeChart();
});

function updateDailyNutrition() {
    const date = new Date().toISOString().split('T')[0];
    const dailyData = JSON.parse(localStorage.getItem(`nutrition_${date}`) || '{}');
    
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;

    // Calculate totals from all meals
    Object.values(dailyData).forEach(meals => {
        meals.forEach(meal => {
            totalCalories += meal.總熱量 || 0;
            meal.主要成份.forEach(item => {
                totalCarbs += item.營養成分.碳水化合物 || 0;
                totalProtein += item.營養成分.蛋白質 || 0;
                totalFat += item.營養成分.脂肪 || 0;
            });
        });
    });

    // Update the display
    document.getElementById('totalCalories').textContent = Math.round(totalCalories);
    document.getElementById('totalCarbs').textContent = Math.round(totalCarbs);
    document.getElementById('totalProtein').textContent = Math.round(totalProtein);
    document.getElementById('totalFat').textContent = Math.round(totalFat);
}

function initializeChart() {
    const ctx = document.getElementById('nutritionChart').getContext('2d');
    const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
    const tdee = profileData.tdee || 0;

    // Get the last 7 days of data
    const dates = [];
    const calories = [];
    const tdeeData = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dailyData = JSON.parse(localStorage.getItem(`nutrition_${dateStr}`) || '{}');

        let dailyCalories = 0;
        Object.values(dailyData).forEach(meals => {
            meals.forEach(meal => {
                dailyCalories += meal.總熱量 || 0;
            });
        });

        dates.push(dateStr.split('-').slice(1).join('/'));  // MM/DD format
        calories.push(dailyCalories || null);
        tdeeData.push(tdee);
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: '每日攝取熱量',
                    data: calories,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'TDEE目標',
                    data: tdeeData,
                    borderColor: 'rgb(255, 99, 132)',
                    borderDash: [5, 5],
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '熱量 (大卡)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '每日熱量攝取與TDEE比較'
                }
            }
        }
    });
}
