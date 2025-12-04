import React, { useMemo } from "react";
import { computeStats, compareTwoDays } from "../lib/weatherRules.js";

export default function ComparisonSummary({ data }) {
  const { thisWeek, nextWeek, loading } = data;

  const summary = useMemo(() => {
    if (loading) {
      return {
        title: "Loading forecast…",
        body: "Fetching this week and next week so we can make a feels-like recommendation."
      };
    }

    const thisStats = computeStats(thisWeek?.data?.hourly || []);
    const nextStats = computeStats(nextWeek?.data?.hourly || []);
    return compareTwoDays(thisStats, nextStats);
  }, [thisWeek, nextWeek, loading]);

  return (
    <div className="card decision-card">
      <h2>{summary.title}</h2>
      <p>{summary.body}</p>
    </div>
  );
}
