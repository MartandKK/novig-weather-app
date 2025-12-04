import React, { useState, useMemo } from "react";
import { WEEKDAYS } from "../App.jsx";
import { formatHourLabel } from "../lib/dateUtils.js";

const CITY_SUGGESTIONS = [
  "San Francisco, CA",
  "Los Angeles, CA",
  "New York, NY",
  "Chicago, IL",
  "Seattle, WA",
  "Austin, TX",
  "Denver, CO",
  "London, UK",
  "Berlin, DE",
  "Tokyo, JP",
  "Sydney, AU"
];

export default function EventControls({ value, onChange, onRefresh }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (field, newVal) => {
    onChange({
      ...value,
      [field]: newVal
    });
  };

  const filteredSuggestions = useMemo(() => {
    const q = value.location.trim().toLowerCase();
    if (!q) return [];
    return CITY_SUGGESTIONS.filter((city) =>
      city.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [value.location]);

  const handleSuggestionClick = (city) => {
    handleChange("location", city);
    setShowSuggestions(false);
  };

  return (
    <aside className="card controls-card">
      <h2>Meetup settings</h2>

      {/* Location with simple local autocomplete */}
      <label className="field">
        <span>Location</span>
        <div className="location-autocomplete">
          <input
            type="text"
            value={value.location}
            onChange={(e) => {
              handleChange("location", e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // small delay so click on suggestion still registers
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            placeholder="e.g. San Francisco, CA"
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="location-suggestions">
              {filteredSuggestions.map((city) => (
                <li
                  key={city}
                  className="suggestion-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSuggestionClick(city);
                  }}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
      </label>

      <label className="field">
        <span>Day of week</span>
        <select
          value={value.weekdayIndex}
          onChange={(e) => handleChange("weekdayIndex", Number(e.target.value))}
        >
          {WEEKDAYS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </label>

      <div className="field row">
        <div>
          <span>Start time</span>
          <select
            value={value.startHour}
            onChange={(e) => handleChange("startHour", Number(e.target.value))}
          >
            {Array.from({ length: 24 }).map((_, h) => (
              <option key={h} value={h}>
                {formatHourLabel(h)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span>End time</span>
          <select
            value={value.endHour}
            onChange={(e) => handleChange("endHour", Number(e.target.value))}
          >
            {Array.from({ length: 24 }).map((_, h) => (
              <option key={h} value={h}>
                {formatHourLabel(h)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="primary-btn" onClick={onRefresh}>
        Update forecast
      </button>

      <p className="hint">
        Set the location and time window for your weekly meetup. The app compares this
        week&apos;s weather to next week&apos;s and suggests what it&apos;ll *feel* like.
      </p>
    </aside>
  );
}
