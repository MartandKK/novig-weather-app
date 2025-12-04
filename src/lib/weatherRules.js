export function computeStats(hourly) {
  if (!hourly || hourly.length === 0) {
    return null;
  }
  const n = hourly.length;
  const sum = (arr, key) => arr.reduce((s, x) => s + x[key], 0);

  const avgTemp = sum(hourly, "temp") / n;
  const avgHumid = sum(hourly, "humidity") / n;
  const avgWind = sum(hourly, "wind") / n;
  const maxPrecip = Math.max(...hourly.map((h) => h.precipProb));

  return { avgTemp, avgHumid, avgWind, maxPrecip };
}

function iconForSummary(label) {
  switch (label) {
    case "Nice day":
      return "🌤";
    case "Likely cancel":
      return "⛈";
    case "Chance of rain":
      return "🌧";
    case "Chilly but dry":
      return "🧥";
    case "Hot and dry":
      return "🔥";
    case "Decent conditions":
      return "🌦";
    default:
      return "ℹ️";
  }
}

export function summarizeStats(stats) {
  if (!stats) {
    return {
      label: "No data",
      detail: "Try a different time range or location.",
      severity: "neutral",
      icon: "ℹ️"
    };
  }

  const { avgTemp, avgHumid, avgWind, maxPrecip } = stats;

  if (maxPrecip > 0.6 || avgWind > 20) {
    const label = "Likely cancel";
    return {
      label,
      detail: "Wet or windy conditions – strongly consider rescheduling or moving indoors.",
      severity: "bad",
      icon: iconForSummary(label)
    };
  }

  if (avgTemp >= 60 && avgTemp <= 75 && avgHumid >= 25 && avgHumid <= 75 && maxPrecip < 0.3) {
    const label = "Nice day";
    return {
      label,
      detail: "Comfortable weather – ideal for food, games, and hanging out.",
      severity: "good",
      icon: iconForSummary(label)
    };
  }

  if (maxPrecip >= 0.3) {
    const label = "Chance of rain";
    return {
      label,
      detail: "Pack tarps and jackets, and consider a backup plan.",
      severity: "warn",
      icon: iconForSummary(label)
    };
  }

  if (avgTemp < 55) {
    const label = "Chilly but dry";
    return {
      label,
      detail: "Ask guests to bring layers and warm drinks.",
      severity: "warn",
      icon: iconForSummary(label)
    };
  }

  if (avgTemp > 80) {
    const label = "Hot and dry";
    return {
      label,
      detail: "Encourage shade and hydration; maybe lighter activities.",
      severity: "warn",
      icon: iconForSummary(label)
    };
  }

  const label = "Decent conditions";
  return {
    label,
    detail: "Not perfect, but likely fine with light preparation.",
    severity: "neutral",
    icon: iconForSummary(label)
  };
}

/**
 * Compare two days and return a feels-like recommendation.
 */
export function compareTwoDays(thisStats, nextStats) {
  if (!thisStats && !nextStats) {
    return {
      title: "Feels-like recommendation",
      body: "Enter a location and time window to compare this week vs next week."
    };
  }

  if (thisStats && !nextStats) {
    return {
      title: "Feels-like recommendation: only this week",
      body: "We only have data for this week – decide based on these conditions."
    };
  }

  if (!thisStats && nextStats) {
    return {
      title: "Feels-like recommendation: only next week",
      body: "We only have data for next week – consider planning around that date."
    };
  }

  const score = (s) => {
    const precipScore = s.maxPrecip * 100; // 0–100
    const windScore = s.avgWind * 2;
    const tempComfort = Math.abs(s.avgTemp - 70); // distance from 70°F
    return precipScore + windScore + tempComfort;
  };

  const sThis = score(thisStats);
  const sNext = score(nextStats);

  if (sThis + 5 < sNext) {
    return {
      title: "Feels-like recommendation: this week looks better",
      body:
        "Weather is more comfortable and/or drier this week – keeping the meetup as scheduled is reasonable."
    };
  }

  if (sNext + 5 < sThis) {
    return {
      title: "Feels-like recommendation: next week looks better",
      body:
        "Next week is noticeably more favorable – consider pushing the meetup back one week."
    };
  }

  return {
    title: "Feels-like recommendation: both weeks are similar",
    body:
      "Conditions are roughly comparable – pick based on non-weather factors like attendance or venue availability."
  };
}
