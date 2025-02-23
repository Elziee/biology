document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input, select');
    
    // Add event listeners to all form inputs
    inputs.forEach(input => {
        input.addEventListener('change', calculateAndSave);
    });

    // Load saved data
    loadProfileData();
});

function calculateBMR(age, gender, weight, height) {
    // Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    return Math.round(bmr);
}

function calculateTDEE(bmr, activityLevel) {
    const activityMultipliers = {
        '1': 1.2,  // 久座不動
        '2': 1.375,  // 輕度活動
        '3': 1.55,  // 中度活動
        '4': 1.725,  // 重度活動
        '5': 1.9  // 極重度運動
    };
    return Math.round(bmr * activityMultipliers[activityLevel]);
}

function calculateAndSave() {
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const activityLevel = document.getElementById('activityLevel').value;
    const dietHabit = document.getElementById('dietHabit').value;

    if (age && gender && weight && height && activityLevel && dietHabit) {
        const bmr = calculateBMR(age, gender, weight, height);
        const tdee = calculateTDEE(bmr, activityLevel);

        // Update display
        document.getElementById('bmr').textContent = bmr;
        document.getElementById('tdee').textContent = tdee;

        // Save to localStorage
        const profileData = {
            age,
            gender,
            weight,
            height,
            activityLevel,
            dietHabit,
            bmr,
            tdee,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('profileData', JSON.stringify(profileData));
    }
}

function loadProfileData() {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('age').value = data.age;
        document.getElementById('gender').value = data.gender;
        document.getElementById('weight').value = data.weight;
        document.getElementById('height').value = data.height;
        document.getElementById('activityLevel').value = data.activityLevel;
        document.getElementById('dietHabit').value = data.dietHabit;
        document.getElementById('bmr').textContent = data.bmr;
        document.getElementById('tdee').textContent = data.tdee;
    }
}
