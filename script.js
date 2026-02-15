```javascript
// RAMADAN 2026 - OPTIMIZED VERSION (FIXED FOR FEB-MAR)
const CONFIG = {
    city: 'Karachi',
    country: 'Pakistan',
    latitude: 24.8607,
    longitude: 67.0011,
    ramadanStartDate: new Date('2026-02-18T00:00:00+05:00'),
    calculationMethod: 1
};

let ramadanTimings = [];
let currentRamadanDay = 0;
let countdownInterval = null;

// Permanent dark mode
function initTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
}

function toggleTheme() {
    // Disabled - permanent dark
}

function getCurrentPKTDate() {
    const now = new Date();
    const pktOffset = 5 * 60;
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (pktOffset * 60000));
}

// OPTIMIZED: Fetch Feb + March in 2 calls (Ramadan spans both months)
async function fetchMonthTimings() {
    try {
        console.log('Fetching all timings...');
        
        // Fetch February 2026
        const urlFeb = `https://api.aladhan.com/v1/calendar/2026/2?latitude=${CONFIG.latitude}&longitude=${CONFIG.longitude}&method=${CONFIG.calculationMethod}`;
        const responseFeb = await fetch(urlFeb);
        const dataFeb = await responseFeb.json();
        
        // Fetch March 2026
        const urlMar = `https://api.aladhan.com/v1/calendar/2026/3?latitude=${CONFIG.latitude}&longitude=${CONFIG.longitude}&method=${CONFIG.calculationMethod}`;
        const responseMar = await fetch(urlMar);
        const dataMar = await responseMar.json();
        
        if (dataFeb.code === 200 && dataMar.code === 200) {
            // Ramadan: 18 Feb (index 17) to 19 March
            // Get last 11 days of Feb (18-28) + first 19 days of March (1-19)
            const febDays = dataFeb.data.slice(17); // 18 Feb onwards
            const marDays = dataMar.data.slice(0, 19); // 1-19 March
            
            const allRamadanDays = [...febDays, ...marDays];
            
            ramadanTimings = allRamadanDays.map((day, index) => ({
                day: index + 1,
                gregorianDay: day.date.gregorian.day,
                gregorianMonth: day.date.gregorian.month.en,
                gregorianYear: day.date.gregorian.year,
                hijriDate: `${day.date.hijri.day} ${day.date.hijri.month.en} ${day.date.hijri.year}`,
                hijriDay: day.date.hijri.day,
                hijriMonth: day.date.hijri.month.en,
                sehri: day.timings.Fajr,
                iftar: day.timings.Maghrib,
            }));
            
            console.log(`✅ Loaded ${ramadanTimings.length} days from API!`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

function getCurrentRamadanDay() {
    const now = getCurrentPKTDate();
    const startDate = new Date(CONFIG.ramadanStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 29);
    
    if (now < startDate) return 0;
    if (now > endDate) return -1;
    return Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
}

function updateCurrentDayDisplay() {
    currentRamadanDay = getCurrentRamadanDay();
    const now = getCurrentPKTDate();
    
    const dayEl = document.getElementById('currentRamadanDay');
    const hijriEl = document.getElementById('hijriDate');
    const gregorianEl = document.getElementById('gregorianDate');
    const statusEl = document.getElementById('statusText');
    const todayDateEl = document.getElementById('todayDate');
    
    if (todayDateEl) {
        todayDateEl.textContent = now.toLocaleDateString('en-GB', { 
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
        });
    }
    
    if (currentRamadanDay === 0) {
        const daysUntil = Math.ceil((CONFIG.ramadanStartDate - now) / (1000 * 60 * 60 * 24));
        dayEl.textContent = '⏳';
        hijriEl.textContent = 'Ramadan 1447 AH';
        gregorianEl.textContent = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        statusEl.textContent = `Ramadan starts in ${daysUntil} days`;
        document.getElementById('todayTimingsSection').style.display = 'none';
    } else if (currentRamadanDay > 0 && currentRamadanDay <= 30) {
        dayEl.textContent = currentRamadanDay;
        const timing = ramadanTimings[currentRamadanDay - 1];
        if (timing) {
            hijriEl.textContent = timing.hijriDate;
            gregorianEl.textContent = `${timing.gregorianDay} ${timing.gregorianMonth} ${timing.gregorianYear}`;
            statusEl.textContent = `Day ${currentRamadanDay} of Ramadan`;
            document.getElementById('todaySehri').textContent = formatTime(timing.sehri);
            document.getElementById('todayIftar').textContent = formatTime(timing.iftar);
            document.getElementById('todayTimingsSection').style.display = 'block';
        }
    } else {
        dayEl.textContent = '✓';
        hijriEl.textContent = 'Ramadan Complete';
        statusEl.textContent = 'Eid Mubarak!';
        document.getElementById('todayTimingsSection').style.display = 'none';
    }
}

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();
}

function updateCountdown() {
    const now = getCurrentPKTDate();
    const targetTime = new Date(CONFIG.ramadanStartDate);
    const timeDiff = targetTime - now;
    
    if (timeDiff > 0 && currentRamadanDay === 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        document.getElementById('countdownMessage').textContent = 'Ramadan starts Wednesday, 18 Feb 2026!';
    }
}

function populateTimetable() {
    const tbody = document.getElementById('timetableBody');
    tbody.innerHTML = '';
    
    if (ramadanTimings.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="5" style="text-align: center; padding: 30px;">
                Loading timings...
            </td></tr>
        `;
        return;
    }
    
    ramadanTimings.forEach(timing => {
        const row = document.createElement('tr');
        if (timing.day === currentRamadanDay) row.classList.add('current-day');
        
        row.innerHTML = `
            <td>${timing.day}</td>
            <td>${timing.hijriDay} ${timing.hijriMonth}</td>
            <td>${timing.gregorianDay} ${timing.gregorianMonth} ${timing.gregorianYear}</td>
            <td>${formatTime(timing.sehri)}</td>
            <td>${formatTime(timing.iftar)}</td>
        `;
        tbody.appendChild(row);
    });
}

function formatTime(time24) {
    const cleanTime = time24.split(' ')[0];
    const [hours, minutes] = cleanTime.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

async function initializeApp() {
    console.log('🌙 Ramadan 2026 - Fast Loading...');
    
    initTheme();
    document.getElementById('cityName').textContent = `${CONFIG.city}, ${CONFIG.country}`;
    
    // Show loading
    const tbody = document.getElementById('timetableBody');
    tbody.innerHTML = `
        <tr><td colspan="5" style="text-align: center; padding: 40px;">
            <div class="loader"></div>
            Fetching prayer timings from API...
        </td></tr>
    `;
    
    try {
        // Fetch Feb + March (only 2 API calls - FAST!)
        const success = await fetchMonthTimings();
        
        if (success && ramadanTimings.length === 30) {
            updateCurrentDayDisplay();
            populateTimetable();
            startCountdown();
            console.log('✅ Done! All 30 days loaded!');
        } else {
            throw new Error('Failed to load timings');
        }
    } catch (error) {
        console.error('Error:', error);
        tbody.innerHTML = `
            <tr><td colspan="5" style="text-align: center; padding: 30px; color: #ff6b6b;">
                Failed to load timings. Please refresh the page.
            </td></tr>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.style.display = 'none'; // Hide toggle
    initializeApp();
});
```
