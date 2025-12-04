// src/lib/weatherIcons.js


export const ICON_MAP = {
  "clear-day": "☀️",
  "clear-night": "🌕",
  "partly-cloudy-day": "⛅",
  "partly-cloudy-night": "☁️🌙",
  cloudy: "☁️",
  rain: "🌧️",
  snow: "❄️",
  sleet: "🌨️",
  wind: "💨",
  fog: "🌫️",
  hail: "🧊",
  thunderstorm: "⛈️",
};


// fallback
export function getWeatherIcon(iconName) {
  return ICON_MAP[iconName] || "🌤️";
}


