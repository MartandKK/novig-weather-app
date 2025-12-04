# Meetup Weather Planner

A lightweight React prototype that helps a meetup organizer compare this week’s weather vs next week’s for a recurring outdoor event. The goal is to give organizers a simple way to decide whether to continue, prepare, or cancel the meetup based on conditions like rain, wind, temperature, and overall comfort.

The focus was on:

1. Interpreting the design intent
2. Implementing good-enough architecture that can evolve
3. Integrating with the Visual Crossing Weather API
4. Delivering a polished, user-friendly experience
5. Enabling rapid experimentation and iteration


# Project Overview

Meetup hosts often rely on rough guesses or scattered weather apps to decide whether this week's meetup should continue. This prototype provides a single screen where users can:

1. Set the location
2. Choose the weekday for the recurring meetup
3. Select the time window (e.g., 3 PM – 6 PM)
4. Instantly compare this week’s weather vs next week’s weather
5. See a plain-language summary like “Nice Day,” “Chance of Rain,” or “Likely Cancel”
6. View temperature trends with charts and weather icons
7. Get an automatic Feels-Like Recommendation based on actual conditions

The layout follows the reference sketch in the assigned pdf.

# Features Implemented

1. Location, Day & Time Controls
A simple control panel allows the organizer to update:
  a. City or location
  b. Day of the week
  c. Start & end time of the meetup

The UI updates in real-time and re-fetches weather automatically.

2. This Week vs Next Week Comparison
Two weather cards sit side-by-side:
  a. Detailed hourly temperature chart
  b. Weather icons (rain, sun, cloud, wind)
  c. Summary badge (Nice Day / Chance of Rain / Likely Cancel / etc.)
  d. Compact, scroll-friendly layout
  e. Fully responsive for mobile screens

3. Automatic “Feels-Like” Recommendation
A custom recommendation engine reads:
  a. Temperature
  b. Humidity
  c. Wind
  d. Precipitation probability

It returns a clear decision:
a. “This week is better — go ahead.”
b. “Next week looks nicer — consider rescheduling.”
c. “Both weeks look rough — consider moving indoors.”


4. Visual Crossing API Integration
Weather data is fetched from:
https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/

The app handles:
  a. URL formatting
  b. Hourly data extraction
  c. Error states
  d. Loading indicators
  e. Debug logs during development


5. Weather Icons
Each hourly block includes a representative weather icon:
☀️ Sunny
⛅ Partly cloudy
🌧️ Rain
🌫️ Fog
🌬️ Windy

Icons help users quickly skim conditions without reading charts.


# Tech Stack

1. React (Vite)
2. Chart.js + react-chartjs-2
3. Visual Crossing Weather API
4. Custom heuristics for recommendations
5. CSS


# File Structure

src/
  App.jsx
  main.jsx
  styles.css
  Components/
      EventControls.jsx
      WeatherCard.jsx
      ComparisonSummary.jsx
  hooks/
      useEventWeather.js
  lib/
      cities.js
      dateUtils.js
      weatherRules.js
      weatherIcons.js
      recommendation.js
.env


# Environment Variables

Create a .env file in the project root:
VITE_WEATHER_API_KEY=YOUR_API_KEY_HERE


# Running the Project

Install dependencies:
npm install

Start the dev server:
npm run dev

Open the app:
http://localhost:5173


# Future Iterations

Next steps could include:
1. Cloud cover visualization
2. Hourly precipitation chart
3. Comparisons beyond one week

These would both enrich the UX and allow more robust A/B testing.


Thank you!
