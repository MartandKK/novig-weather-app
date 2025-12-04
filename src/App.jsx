import React, { useState, useMemo } from "react";
import EventControls from "./Components/EventControls.jsx";
import WeatherCard from "./Components/WeatherCard.jsx";
import ComparisonSummary from "./Components/ComparisonSummary.jsx";
import useEventWeather from "./hooks/useEventWeather.js";

export const WEEKDAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" }
];

const DEFAULT_CONTROLS = {
  location: "San Francisco, CA",
  weekdayIndex: 5, // Friday
  startHour: 15,   // 3 PM
  endHour: 18      // 6 PM
};

export default function App() {
  const [controls, setControls] = useState(DEFAULT_CONTROLS);
  const [refreshToken, setRefreshToken] = useState(0);

  const { thisWeek, nextWeek, loading, refresh } = useEventWeather({
    location: controls.location,
    weekdayIndex: controls.weekdayIndex,
    startHour: controls.startHour,
    endHour: controls.endHour,
    refreshToken
  });

  const handleRefresh = () => {
    setRefreshToken((t) => t + 1);
    refresh();
  };

  const comparisonInput = useMemo(
    () => ({
      thisWeek,
      nextWeek,
      loading
    }),
    [thisWeek, nextWeek, loading]
  );

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Meetup Weather Planner</h1>
        <p>
          Compare this week&apos;s and next week&apos;s weather for your recurring outdoor meetup,
          then get a simple feels-like recommendation: go ahead, prepare for rain, or reschedule.
        </p>
      </header>

      <main className="app-main">
        <EventControls
          value={controls}
          onChange={setControls}
          onRefresh={handleRefresh}
        />

        <section className="forecast-section">
          <ComparisonSummary data={comparisonInput} />

          <div className="comparison-grid">
            <WeatherCard title="This week" state={thisWeek} loading={loading} />
            <WeatherCard title="Next week" state={nextWeek} loading={loading} />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span>Powered by Visual Crossing Weather API</span>
      </footer>
    </div>
  );
}
