import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { computeStats, summarizeStats } from "../lib/weatherRules.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function WeatherCard({ title, state, loading }) {
  const { error, data } = state || {};

  const stats = useMemo(() => {
    if (!data || !data.hourly) return null;
    return computeStats(data.hourly);
  }, [data]);

  const summary = useMemo(() => summarizeStats(stats), [stats]);

  const chartData = useMemo(() => {
    const labels = data?.hourly?.map((h) => h.timeLabel) || [];
    const temps = data?.hourly?.map((h) => h.temp) || [];
    return {
      labels,
      datasets: [
        {
          label: "Temperature (°F)",
          data: temps,
          borderColor: "#16a34a",
          fill: false,
          tension: 0.3
        }
      ]
    };
  }, [data]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} °F`
        }
      }
    },
    scales: {
      y: {
        title: { display: true, text: "°F" }
      }
    }
  };

  const severityClass =
    summary.severity === "good"
      ? "badge badge-good"
      : summary.severity === "bad"
      ? "badge badge-bad"
      : summary.severity === "warn"
      ? "badge badge-warn"
      : "badge";

  return (
    <article className="card weather-card">
      <div className="weather-card-header">
        <div className="weather-card-title-block">
          <h3>{title}</h3>
          {data && <p className="subtext">{data.displayDate}</p>}
        </div>
        <div className="badge-with-icon">
          {summary.icon && <span className="weather-icon">{summary.icon}</span>}
          <span className={severityClass}>{summary.label}</span>
        </div>
      </div>

      {loading && <p>Loading forecast…</p>}
      {!loading && error && <p className="error">{error}</p>}

      {!loading && !error && data && data.hourly?.length > 0 && (
        <>
          <div className="chart-wrapper">
            <Line data={chartData} options={chartOptions} />
          </div>
          <p className="summary-detail">{summary.detail}</p>
        </>
      )}

      {!loading && !error && data && data.hourly?.length === 0 && (
        <p>No hourly data for the selected time range.</p>
      )}
    </article>
  );
}
