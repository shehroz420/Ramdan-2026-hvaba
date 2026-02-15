```javascript
// RAMADAN 2026 - WORKING VERSION
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

function getCurrentPKTDate() {
    const now = new Date();
    const pktOffset = 5 * 60; // PKT is UTC+5
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (pktOffset * 60000));
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    {
// PERMANENT DARK MODE - NO TOGGLE
function initTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
}

function toggleTheme() {
    // Theme toggle disabled - permanent dark mode
}

async function fetchPrayerTimes(date) {
    try {
        const timestamp = Math.floor(date.getTime() / 1000);
        const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${CONFIG.latitude}&longitude=${CONFIG.longitude}&method=${CONFIG.calculationMethod}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.code === 200 ? data.data : null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function calculateRamadanTimings() {
    ramadanTimings = [];
    const startDate = new Date(CONFIG.ramadanStartDate);
    
    for (let day = 0; day < 30; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);
        const prayerData = await fetchPrayerTimes(currentDate);
        
        if (prayerData) {
            ramadanTimings.push({
                day: day + 1,
                gregorianDay: prayerData.date.gregorian.day,
                gregorianMonth: prayerData.date.gregorian.month.en,
                gregorianYear: prayerData.date.gregorian.year,
                hijriDate: `${prayerData.date.hijri.day} ${prayerData.date.hijri.month.en} ${prayerData.date.hijri.year}`,
                hijriDay: prayerData.date.hijri.day,
                hijriMonth: prayerData.date.hijri.month.en,
                sehri: prayerData.timings.Fajr,
                iftar: prayerData.timings.Maghrib,
            });
        }
        await new Promise(resolve => setTimeout(resolve, 100));
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
    
    if (currentRamadanDay === 0) {
        const daysUntil = Math.ceil((CONFIG.ramadanStartDate - now) / (1000 * 60 * 60 * 24));
        dayEl.textContent = '⏳';
        hijriEl.textContent = 'Ramadan 1447 AH';
        gregorianEl.textContent = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        statusEl.textContent = `Ramadan starts in ${daysUntil} days`;
    } else if (currentRamadanDay > 0) {
        dayEl.textContent = currentRamadanDay;
        const timing = ramadanTimings.find(t => t.day === currentRamadanDay);
        if (timing) {
            hijriEl.textContent = timing.hijriDate;
            gregorianEl.textContent = `${timing.gregorianDay} ${timing.gregorianMonth} ${timing.gregorianYear}`;
            statusEl.textContent = `Day ${currentRamadanDay} of Ramadan`;
        }
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
    
    if (timeDiff > 0) {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
}

function populateTimetable() {
    const tbody = document.getElementById('timetableBody');
    tbody.innerHTML = '';
    
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
    initTheme();
    document.body.classList.add('loading');
    
    try {
        await calculateRamadanTimings();
        updateCurrentDayDisplay();
        populateTimetable();
        startCountdown();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        document.body.classList.remove('loading');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('click', toggleTheme);
    }
    initializeApp();
});
```
