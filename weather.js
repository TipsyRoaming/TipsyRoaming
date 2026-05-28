export async function fetchWeather() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=16.4164&longitude=120.5931&current_weather=true');
        const data = await response.json();
        return Math.round(data.current_weather.temperature);
    } catch {
        return null;
    }
}