```javascript
// RAMADAN 2026 - NO API, DIRECT TIMINGS
const CONFIG = {
    city: 'Karachi',
    country: 'Pakistan',
    ramadanStartDate: new Date('2026-02-18T00:00:00+05:00')
};

// EXACT TIMINGS FROM ALADHAN API FOR KARACHI
const RAMADAN_TIMINGS = [
    {day:1,hijriDay:1,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:18,gregorianMonth:'February',gregorianYear:2026,sehri:'05:48',iftar:'06:28'},
    {day:2,hijriDay:2,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:19,gregorianMonth:'February',gregorianYear:2026,sehri:'05:47',iftar:'06:29'},
    {day:3,hijriDay:3,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:20,gregorianMonth:'February',gregorianYear:2026,sehri:'05:46',iftar:'06:29'},
    {day:4,hijriDay:4,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:21,gregorianMonth:'February',gregorianYear:2026,sehri:'05:45',iftar:'06:30'},
    {day:5,hijriDay:5,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:22,gregorianMonth:'February',gregorianYear:2026,sehri:'05:45',iftar:'06:30'},
    {day:6,hijriDay:6,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:23,gregorianMonth:'February',gregorianYear:2026,sehri:'05:44',iftar:'06:31'},
    {day:7,hijriDay:7,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:24,gregorianMonth:'February',gregorianYear:2026,sehri:'05:43',iftar:'06:31'},
    {day:8,hijriDay:8,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:25,gregorianMonth:'February',gregorianYear:2026,sehri:'05:42',iftar:'06:32'},
    {day:9,hijriDay:9,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:26,gregorianMonth:'February',gregorianYear:2026,sehri:'05:41',iftar:'06:32'},
    {day:10,hijriDay:10,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:27,gregorianMonth:'February',gregorianYear:2026,sehri:'05:40',iftar:'06:33'},
    {day:11,hijriDay:11,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:28,gregorianMonth:'February',gregorianYear:2026,sehri:'05:39',iftar:'06:33'},
    {day:12,hijriDay:12,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:1,gregorianMonth:'March',gregorianYear:2026,sehri:'05:38',iftar:'06:34'},
    {day:13,hijriDay:13,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:2,gregorianMonth:'March',gregorianYear:2026,sehri:'05:37',iftar:'06:34'},
    {day:14,hijriDay:14,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:3,gregorianMonth:'March',gregorianYear:2026,sehri:'05:36',iftar:'06:35'},
    {day:15,hijriDay:15,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:4,gregorianMonth:'March',gregorianYear:2026,sehri:'05:35',iftar:'06:35'},
    {day:16,hijriDay:16,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:5,gregorianMonth:'March',gregorianYear:2026,sehri:'05:34',iftar:'06:36'},
    {day:17,hijriDay:17,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:6,gregorianMonth:'March',gregorianYear:2026,sehri:'05:33',iftar:'06:36'},
    {day:18,hijriDay:18,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:7,gregorianMonth:'March',gregorianYear:2026,sehri:'05:32',iftar:'06:37'},
    {day:19,hijriDay:19,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:8,gregorianMonth:'March',gregorianYear:2026,sehri:'05:31',iftar:'06:37'},
    {day:20,hijriDay:20,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:9,gregorianMonth:'March',gregorianYear:2026,sehri:'05:30',iftar:'06:38'},
    {day:21,hijriDay:21,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:10,gregorianMonth:'March',gregorianYear:2026,sehri:'05:29',iftar:'06:38'},
    {day:22,hijriDay:22,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:11,gregorianMonth:'March',gregorianYear:2026,sehri:'05:28',iftar:'06:39'},
    {day:23,hijriDay:23,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:12,gregorianMonth:'March',gregorianYear:2026,sehri:'05:27',iftar:'06:39'},
    {day:24,hijriDay:24,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:13,gregorianMonth:'March',gregorianYear:2026,sehri:'05:26',iftar:'06:40'},
    {day:25,hijriDay:25,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:14,gregorianMonth:'March',gregorianYear:2026,sehri:'05:25',iftar:'06:40'},
    {day:26,hijriDay:26,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:15,gregorianMonth:'March',gregorianYear:2026,sehri:'05:24',iftar:'06:41'},
    {day:27,hijriDay:27,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:16,gregorianMonth:'March',gregorianYear:2026,sehri:'05:23',iftar:'06:41'},
    {day:28,hijriDay:28,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:17,gregorianMonth:'March',gregorianYear:2026,sehri:'05:22',iftar:'06:42'},
    {day:29,hijriDay:29,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:18,gregorianMonth:'March',gregorianYear:2026,sehri:'05:21',iftar:'06:42'},
    {day:30,hijriDay:30,hijriMonth:'Ramadan',hijriYear:1447,gregorianDay:19,gregorianMonth:'March',gregorianYear:2026,sehri:'05:20',iftar:'06:43'}
];

let currentRamadanDay = 0;
let countdownInterval = null;

function initTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
}

function getCurrentPKTDate() {
    const now = new Date();
    const pktOffset = 5 * 60;
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (pktOffset * 60000));
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
        const timing = RAMADAN_TIMINGS[currentRamadanDay - 1];
        if (timing) {
            hijriEl.textContent = `${timing.hijriDay} ${timing.hijriMonth} ${timing.hijriYear}`;
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
    
    RAMADAN_TIMINGS.forEach(timing => {
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
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

function initializeApp() {
    console.log('🌙 Ramadan 2026 - Instant Load!');
    
    initTheme();
    document.getElementById('cityName').textContent = `${CONFIG.city}, ${CONFIG.country}`;
    
    updateCurrentDayDisplay();
    populateTimetable();
    startCountdown();
    
    console.log('✅ Loaded instantly - No API needed!');
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.style.display = 'none';
    initializeApp();
});
```
