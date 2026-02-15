```javascript
// RAMADAN 2026 - WITH TIMEOUT & FALLBACK
const CONFIG = {
    city: 'Karachi',
    country: 'Pakistan',
    latitude: 24.8607,
    longitude: 67.0011,
    ramadanStartDate: new Date('2026-02-18T00:00:00+05:00'),
    calculationMethod: 1
};

// BACKUP TIMINGS (if API fails)
const BACKUP_TIMINGS = [
    {day:1,hijriDay:1,hijriMonth:'Ramadan',gregorianDay:18,gregorianMonth:'February',gregorianYear:2026,sehri:'05:10',iftar:'06:28'},
    {day:2,hijriDay:2,hijriMonth:'Ramadan',gregorianDay:19,gregorianMonth:'February',gregorianYear:2026,sehri:'05:09',iftar:'06:29'},
    {day:3,hijriDay:3,hijriMonth:'Ramadan',gregorianDay:20,gregorianMonth:'February',gregorianYear:2026,sehri:'05:08',iftar:'06:29'},
    {day:4,hijriDay:4,hijriMonth:'Ramadan',gregorianDay:21,gregorianMonth:'February',gregorianYear:2026,sehri:'05:07',iftar:'06:30'},
    {day:5,hijriDay:5,hijriMonth:'Ramadan',gregorianDay:22,gregorianMonth:'February',gregorianYear:2026,sehri:'05:06',iftar:'06:30'},
    {day:6,hijriDay:6,hijriMonth:'Ramadan',gregorianDay:23,gregorianMonth:'February',gregorianYear:2026,sehri:'05:05',iftar:'06:31'},
    {day:7,hijriDay:7,hijriMonth:'Ramadan',gregorianDay:24,gregorianMonth:'February',gregorianYear:2026,sehri:'05:04',iftar:'06:31'},
    {day:8,hijriDay:8,hijriMonth:'Ramadan',gregorianDay:25,gregorianMonth:'February',gregorianYear:2026,sehri:'05:03',iftar:'06:32'},
    {day:9,hijriDay:9,hijriMonth:'Ramadan',gregorianDay:26,gregorianMonth:'February',gregorianYear:2026,sehri:'05:02',iftar:'06:32'},
    {day:10,hijriDay:10,hijriMonth:'Ramadan',gregorianDay:27,gregorianMonth:'February',gregorianYear:2026,sehri:'05:01',iftar:'06:33'},
    {day:11,hijriDay:11,hijriMonth:'Ramadan',gregorianDay:28,gregorianMonth:'February',gregorianYear:2026,sehri:'05:00',iftar:'06:33'},
    {day:12,hijriDay:12,hijriMonth:'Ramadan',gregorianDay:1,gregorianMonth:'March',gregorianYear:2026,sehri:'04:59',iftar:'06:34'},
    {day:13,hijriDay:13,hijriMonth:'Ramadan',gregorianDay:2,gregorianMonth:'March',gregorianYear:2026,sehri:'04:58',iftar:'06:34'},
    {day:14,hijriDay:14,hijriMonth:'Ramadan',gregorianDay:3,gregorianMonth:'March',gregorianYear:2026,sehri:'04:57',iftar:'06:35'},
    {day:15,hijriDay:15,hijriMonth:'Ramadan',gregorianDay:4,gregorianMonth:'March',gregorianYear:2026,sehri:'04:56',iftar:'06:35'},
    {day:16,hijriDay:16,hijriMonth:'Ramadan',gregorianDay:5,gregorianMonth:'March',gregorianYear:2026,sehri:'04:55',iftar:'06:36'},
    {day:17,hijriDay:17,hijriMonth:'Ramadan',gregorianDay:6,gregorianMonth:'March',gregorianYear:2026,sehri:'04:54',iftar:'06:36'},
    {day:18,hijriDay:18,hijriMonth:'Ramadan',gregorianDay:7,gregorianMonth:'March',gregorianYear:2026,sehri:'04:53',iftar:'06:37'},
    {day:19,hijriDay:19,hijriMonth:'Ramadan',gregorianDay:8,gregorianMonth:'March',gregorianYear:2026,sehri:'04:52',iftar:'06:37'},
    {day:20,hijriDay:20,hijriMonth:'Ramadan',gregorianDay:9,gregorianMonth:'March',gregorianYear:2026,sehri:'04:51',iftar:'06:38'},
    {day:21,hijriDay:21,hijriMonth:'Ramadan',gregorianDay:10,gregorianMonth:'March',gregorianYear:2026,sehri:'04:50',iftar:'06:38'},
    {day:22,hijriDay:22,hijriMonth:'Ramadan',gregorianDay:11,gregorianMonth:'March',gregorianYear:2026,sehri:'04:49',iftar:'06:39'},
    {day:23,hijriDay:23,hijriMonth:'Ramadan',gregorianDay:12,gregorianMonth:'March',gregorianYear:2026,sehri:'04:48',iftar:'06:39'},
    {day:24,hijriDay:24,hijriMonth:'Ramadan',gregorianDay:13,gregorianMonth:'March',gregorianYear:2026,sehri:'04:47',iftar:'06:40'},
    {day:25,hijriDay:25,hijriMonth:'Ramadan',gregorianDay:14,gregorianMonth:'March',gregorianYear:2026,sehri:'04:46',iftar:'06:40'},
    {day:26,hijriDay:26,hijriMonth:'Ramadan',gregorianDay:15,gregorianMonth:'March',gregorianYear:2026,sehri:'04:45',iftar:'06:41'},
    {day:27,hijriDay:27,hijriMonth:'Ramadan',gregorianDay:16,gregorianMonth:'March',gregorianYear:2026,sehri:'04:44',iftar:'06:41'},
    {day:28,hijriDay:28,hijriMonth:'Ramadan',gregorianDay:17,gregorianMonth:'March',gregorianYear:2026,sehri:'04:43',iftar:'06:42'},
    {day:29,hijriDay:29,hijriMonth:'Ramadan',gregorianDay:18,gregorianMonth:'March',gregorianYear:2026,sehri:'04:42',iftar:'06:42'},
    {day:30,hijriDay:30,hijriMonth:'Ramadan',gregorianDay:19,gregorianMonth:'March',gregorianYear:2026,sehri:'04:41',iftar:'06:43'}
];

let ramadanTimings = [];
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

// Fetch with timeout
async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

async function fetchMonthTimings() {
    try {
        console.log('Trying API...');
        
        const urlFeb = `https://api.aladhan.com/v1/calendar/2026/2?latitude=${CONFIG.latitude}&longitude=${CONFIG.longitude}&method=${CONFIG.calculationMethod}`;
        const urlMar = `https://api.aladhan.com/v1/calendar/2026/3?latitude=${CONFIG.latitude}&longitude=${CONFIG.longitude}&method=${CONFIG.calculationMethod}`;
        
        const responseFeb = await fetchWithTimeout(urlFeb, 5000);
        const responseMar = await fetchWithTimeout(urlMar, 5000);
        
        const dataFeb = await responseFeb.json();
        const dataMar = await responseMar.json();
        
        if (dataFeb.code === 200 && dataMar.code === 200) {
            const febDays = dataFeb.data.slice(17);
            const marDays = dataMar.data.slice(0, 19);
            const allDays = [...febDays, ...marDays];
            
            ramadanTimings = allDays.map((day, index) => ({
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
            
            console.log('✅ API loaded!');
            return true;
        }
        return false;
    } catch (error) {
        console.log('⚠️ API timeout/failed, using backup');
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
            hijriEl.textContent = `${timing.hijriDay} ${timing.hijriMonth} 1447`;
            gregorianEl.textContent = `${timing.gregorianDay} ${timing.gregorianMonth} ${timing.gregorianYear}`;
            statusEl.textContent = `Day ${currentRamadanDay} of Ramadan`;
            document.getElementById('todaySehri').textContent = formatTime(timing.sehri);
            document.getElementById('todayIftar').textContent = formatTime(timing.iftar);
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
    console.log('🌙 Loading...');
    
    initTheme();
    document.getElementById('cityName').textContent = `${CONFIG.city}, ${CONFIG.country}`;
    
    const tbody = document.getElementById('timetableBody');
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 40px;"><div class="loader"></div>Loading...</td></tr>`;
    
    try {
        const apiSuccess = await fetchMonthTimings();
        
        if (!apiSuccess || ramadanTimings.length !== 30) {
            console.log('Using backup timings');
            ramadanTimings = BACKUP_TIMINGS;
        }
        
        updateCurrentDayDisplay();
        populateTimetable();
        startCountdown();
        console.log('✅ Done!');
    } catch (error) {
        console.log('Using backup');
        ramadanTimings = BACKUP_TIMINGS;
        updateCurrentDayDisplay();
        populateTimetable();
        startCountdown();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.style.display = 'none';
    initializeApp();
});
```
