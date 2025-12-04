import { useEffect, useState, useCallback } from "react";
import { formatDisplayDate, formatDateForAPI, getNextWeekdayDate } from "../lib/dateUtils.js";

const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

// Vite env var: make sure .env has VITE_WEATHER_API_KEY=your_key
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function normalizeHour(h) {
  // Visual Crossing hourly datetime like "10:00:00"
  const timeStr = String(h.datetime);
  const [hourStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);

  const temp = h.temp; // °F for unitGroup=us
  const humidity = h.humidity;
  const wind = h.windspeed;
  let precipProb = h.precipprob ?? 0;

  if (precipProb > 1) precipProb = precipProb / 100;

  return {
    hour,
    timeLabel: timeStr.slice(0, 5), // "HH:MM"
    temp,
    humidity,
    wind,
    precipProb
  };
}

export default function useEventWeather({
  location,
  weekdayIndex,
  startHour,
  endHour,
  refreshToken
}) {
  const [thisWeek, setThisWeek] = useState({
    loading: false,
    error: null,
    data: null
  });
  const [nextWeek, setNextWeek] = useState({
    loading: false,
    error: null,
    data: null
  });
  const [loading, setLoading] = useState(false);

  const fetchWeather = useCallback(async () => {
    if (!location || !API_KEY) {
      setThisWeek({
        loading: false,
        error: "Missing location or API key. Check your .env.",
        data: null
      });
      setNextWeek({
        loading: false,
        error: "Missing location or API key. Check your .env.",
        data: null
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setThisWeek((prev) => ({ ...prev, loading: true, error: null }));
    setNextWeek((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const today = new Date();
      const thisDate = getNextWeekdayDate(today, weekdayIndex, 0);
      const nextDate = getNextWeekdayDate(today, weekdayIndex, 1);

      const thisStr = formatDateForAPI(thisDate);
      const nextStr = formatDateForAPI(nextDate);

      const makeUrl = (dateStr) =>
        `${BASE_URL}/${encodeURIComponent(location)}/${dateStr}/${dateStr}?unitGroup=us&include=hours&key=${API_KEY}&contentType=json`;

      const urls = [makeUrl(thisStr), makeUrl(nextStr)];

      console.log("[DEBUG] Fetching URLs:", urls);

      const [json1, json2] = await Promise.all(
        urls.map((u) =>
          fetch(u).then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
          })
        )
      );

      const processDay = (json, dateObj) => {
        const day = json.days?.[0];
        const hours = Array.isArray(day?.hours) ? day.hours : [];
        const normalized = hours.map(normalizeHour).filter((h) => {
          return h.hour >= startHour && h.hour <= endHour;
        });

        return {
          dateStr: formatDateForAPI(dateObj),
          displayDate: formatDisplayDate(dateObj),
          hourly: normalized
        };
      };

      const thisData = processDay(json1, thisDate);
      const nextData = processDay(json2, nextDate);

      setThisWeek({ loading: false, error: null, data: thisData });
      setNextWeek({ loading: false, error: null, data: nextData });
    } catch (err) {
      console.error("Error fetching weather:", err);
      setThisWeek({
        loading: false,
        error: "Failed to load weather. Try another location or check your key.",
        data: null
      });
      setNextWeek({
        loading: false,
        error: "Failed to load weather. Try another location or check your key.",
        data: null
      });
    } finally {
      setLoading(false);
    }
  }, [location, weekdayIndex, startHour, endHour]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather, refreshToken]);

  return {
    thisWeek,
    nextWeek,
    loading,
    refresh: fetchWeather
  };
}
