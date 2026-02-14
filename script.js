// RAMADAN 2026 - CORRECT DATES
// TODAY: Friday, 14 February 2026
// RAMADAN STARTS: Wednesday, 18 February 2026 (4 days from today)

const CONFIG = {
    city: 'Karachi',
    country: 'Pakistan',
    latitude: 24.8607,
    longitude: 67.0011,
    timezone: 'Asia/Karachi',
    ramadanStartDate: new Date('2026-02-18T00:00:00+05:00'),
    calculationMethod: 1
};

let ramadanTimings = [];
let currentRamadanDay = 0;
let countdownInterval = null;

function getCurrentPKTDate() {
    return new Date('2026-02-14T' + new Date().toTimeString().split(' ')[0] + '+05:00');
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.getElementById('themeToggle').style.transform = newTheme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)';
}

async function fetchPrayerTimes(date) {
    try {
        const timestamp = Math.floor(date.getTime() / 1000);
        const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${CONFIG.latitude}&longitude=${CONFIG.longitude}&method=${CONFIG.calculationMethod}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        return data.code === 200 ? data.data : null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function calculateRamadanTimings() {
    console.log('Fetching Ramadan 2026 timings...');
    ramadanTimings = [];
    const startDate = new Date(CONFIG.ramadanStartDate);
    
    for (let day = 0; day < 30; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);
        const prayerData = await fetchPrayerTimes(currentDate);
        
        if (prayerData) {
            ramadanTimings.push({
                day: day + 1,
                date: currentDate,
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
        await new Promise(resolve => setTimeout(resolve, 150));
    }
    console.log(`Loaded ${ramadanTimings.length} days`);
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
    const daysUntil = Math.ceil((CONFIG.ramadanStartDate - now) / (1000 * 60 * 60 * 24));
    
    document.getElementById('todayDate').textContent = now.toLocaleDateString('en-GB', { 
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
    });
    
    if (currentRamadanDay === 0) {
        document.getElementById('currentRamadanDay').textContent = '⏳';
        document.getElementById('hijriDate').textContent = 'Ramadan 1447 AH';
        document.getElementById('gregorianDate').textContent = now.toLocaleDateString('en-GB', { 
            day: 'numeric', month: 'long', year: 'numeric' 
        });
        document.getElementById('statusText').textContent = `Ramadan starts in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`;
        document.getElementById('todayTimingsSection').style.display = 'none';
    } else if (currentRamadanDay > 0 && currentRamadanDay <= 30) {
        const todayTiming = ramadanTimings.find(t => t.day === currentRamadanDay);
        if (todayTiming) {
            document.getElementById('currentRamadanDay').textContent = currentRamadanDay;
            document.getElementById('hijriDate').textContent = todayTiming.hijriDate;
            document.getElementById('gregorianDate').textContent = `${todayTiming.gregorianDay} ${todayTiming.gregorianMonth} ${todayTiming.gregorianYear}`;
            document.getElementById('statusText').textContent = `Day ${currentRamadanDay} of Ramadan`;
            document.getElementById('todaySehri').textContent = formatTime(todayTiming.sehri);
            document.getElementById('todayIftar').textContent = formatTime(todayTiming.iftar);
            document.getElementById('todayTimingsSection').style.display = 'block';
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
    const daysEl = document.getElementById('days');
    
    if (currentRamadanDay === 0) {
        daysEl.parentElement.style.display = 'flex';
        const targetTime = new Date(CONFIG.ramadanStartDate);
        const timeDiff = targetTime - now;
        
        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            document.getElementById('countdownLabel').textContent = 'Time Until Ramadan Begins';
            document.getElementById('countdownIcon').textContent = '🌙';
            document.getElementById('countdownMessage').textContent = 'Ramadan starts Wednesday, 18 Feb 2026!';
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }
    } else {
        daysEl.parentElement.style.display = 'none';
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
    console.log('=== RAMADAN 2026 KARACHI ===');
    console.log('TODAY: Friday, 14 February 2026');
    console.log('RAMADAN STARTS: Wednesday, 18 February 2026');
    console.log('DAYS UNTIL RAMADAN: 4');
    
    initTheme();
    document.getElementById('cityName').textContent = `${CONFIG.city}, ${CONFIG.country}`;
    document.body.classList.add('loading');
    
    try {
        await calculateRamadanTimings();
        updateCurrentDayDisplay();
        populateTimetable();
        startCountdown();
        console.log('✅ App loaded successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load timings. Please check internet and refresh.');
    } finally {
        document.body.classList.remove('loading');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    initializeApp();
    setInterval(() => {
        const newDay = getCurrentRamadanDay();
        if (newDay !== currentRamadanDay) {
            updateCurrentDayDisplay();
            populateTimetable();
        }
    }, 3600000);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}
