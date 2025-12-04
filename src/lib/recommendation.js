export function generateRecommendation(weather) {
  if (!weather || !weather.temps || weather.temps.length === 0) {
    return "No data available to generate a recommendation yet.";
  }
  
  const avgTemp = weather.temps.reduce((a, b) => a + b, 0) / weather.temps.length;
  const maxWind = Math.max(...weather.winds);
  const willRain = weather.conditions.includes("rain");


  // Rules
  if (willRain) {
    return "Rain expected — consider rescheduling or choosing an indoor venue.";
  }


  if (avgTemp >= 28) {
    return "Very hot during this time — consider a morning meetup or shaded area.";
  }


  if (avgTemp <= 10) {
    return "Quite cold — wear warm layers or consider an indoor event.";
  }


  if (maxWind >= 25) {
    return "Windy conditions — not ideal for outdoor activities.";
  }


  return "Great weather for an outdoor meetup — enjoy!";
}


