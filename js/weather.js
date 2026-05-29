export async function fetchWeather() {
    try {
        const res = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=16.4164&longitude=120.5931&current_weather=true'
        );

        if (!res.ok) return null;

        const data = await res.json();

        return data?.current_weather?.temperature
            ? Math.round(data.current_weather.temperature)
            : null;

    } catch {
        return null;
    }
}