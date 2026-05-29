export async function initWeather() {
    const weatherEl = document.getElementById('baguio-weather');
    if (weatherEl) {
        try {
            const res = await fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=16.4164&longitude=120.5931&current_weather=true'
            );

            if (res.ok) {
                const data = await res.json();
                const temp = Math.round(data.current_weather.temperature);
                weatherEl.innerHTML = `<i class="fas fa-sun" style="color: #FDB813;"></i> ${temp}°C`;
            }
        } catch {
            weatherEl.textContent = 'N/A';
        }
    }

    const holidayEl = document.getElementById('baguio-holiday');
    if (holidayEl) {
        holidayEl.innerHTML = `<i class="fas fa-calendar-alt" style="color: var(--lazy-purple);"></i> Jun 12 (Independence Day)`;
    }
}