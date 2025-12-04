export function getNextWeekdayDate(baseDate, weekdayIndex, offsetWeeks = 0) {
  const d = new Date(baseDate);
  d.setHours(0, 0, 0, 0);
  const currentDay = d.getDay();
  let diff = weekdayIndex - currentDay;
  if (diff < 0) diff += 7;
  d.setDate(d.getDate() + diff + offsetWeeks * 7);
  return d;
}

export function formatDateForAPI(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`; // yyyy-MM-dd
}

export function formatDisplayDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

export function formatHourLabel(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:00 ${suffix}`;
}
