// moment for timezone-aware date handling
import moment from "moment-timezone";

// Utility functions
import { pm25ToColor, pm25ToYMax, pm25_AQILines } from "./plot-utils.js";

/**
 * Returns a dailyRangeBarplot chart configuration.
 * @param {Object} data The data required to create the chart.
 */
export function dailyRangeBarplotConfig(
  data = {
    daily_datetime,
    daily_min,
    daily_mean,
    daily_max,
    locationName,
    timezone,
    title,
  }
) {
  // ----- Data preparation --------------------------------

  let days = data.daily_datetime.map((x) =>
    moment.tz(x, data.timezone).format("MMM DD")
  );

  // Default to well defined y-axis limits for visual stability
  let ymin = 0;
  let ymax = pm25ToYMax(Math.max(...data.daily_mean));

  // NOTE:  Passing in '' as the title will expand the height of the plot
  let title = data.title;
  if (data.title === undefined) {
    title = data.locationName;
  }

  // Create colored series data
  // See:  https://stackoverflow.com/questions/35854947/how-do-i-change-a-specific-bar-color-in-highcharts-bar-chart
  let dailyMean = [];
  for (let i = 0; i < data.daily_datetime.length; i++) {
    dailyMean[i] = {
      y: data.daily_mean[i],
      color: pm25ToColor(data.daily_mean[i]),
    };
  }

  let dailyRange = [];
  for (let i = 0; i < data.daily_datetime.length; i++) {
    dailyRange[i] = [data.daily_min[i], data.daily_max[i]];
  }

  // ----- Chart configuration --------------------------------

  let chartConfig = {
    accessibility: { enabled: false },
    chart: {
      plotBorderColor: "#ddd",
      plotBorderWidth: 1,
    },
    plotOptions: {
      columnrange: {
        animation: false,
      },
    },
    title: {
      text: title,
    },
    xAxis: {
      categories: days,
    },
    yAxis: {
      min: ymin,
      max: ymax,
      gridLineColor: "#ddd",
      gridLineDashStyle: "Dash",
      gridLineWidth: 1,
      title: {
        text: "PM2.5 (\u00b5g/m\u00b3)",
      },
      plotLines: pm25_AQILines(2),
    },
    legend: {
      enabled: true,
      verticalAlign: "top",
    },
    series: [
      {
        name: "Daily Range",
        type: "columnrange",
        data: dailyRange,
        color: "#bbb",
      },
      {
        name: "Daily Mean",
        type: "scatter",
        data: dailyMean,
        animation: false,
        // NOTE:  If the chart width specified in the component html is too small,
        // NOTE:  large symbols that would bump into each other will not be drawn.
        marker: {
          radius: 3,
          symbol: "circle",
          lineColor: "#333",
          lineWidth: 0.5,
        },
      },
    ],
  };

  return chartConfig;
}

/**
 * Returns a dailyRangeBarplot chart configuration.
 * The 'small' version of this plot has no legend or axis labeling and is
 * appropriate for use in a display with "small multiples".
 * @param {Object} data The data required to create the chart.
 */
export function small_dailyRangeBarplotConfig(
  data = {
    daily_datetime,
    daily_min,
    daily_mean,
    daily_max,
    locationName,
    timezone,
    title,
  }
) {
  // ----- Data preparation --------------------------------

  let days = data.daily_datetime.map((x) =>
    moment.tz(x, data.timezone).format("MMM DD")
  );

  // Default to well defined y-axis limits for visual stability
  let ymin = 0;
  let ymax = pm25ToYMax(Math.max(...data.daily_mean));

  // NOTE:  Passing in '' as the title will expand the height of the plot
  let title = data.title;
  if (data.title === undefined) {
    title = data.locationName;
  }

  // Create colored series data
  // See:  https://stackoverflow.com/questions/35854947/how-do-i-change-a-specific-bar-color-in-highcharts-bar-chart
  let dailyMean = [];
  for (let i = 0; i < data.daily_datetime.length; i++) {
    dailyMean[i] = {
      y: data.daily_mean[i],
      color: pm25ToColor(data.daily_mean[i]),
    };
  }

  let dailyRange = [];
  for (let i = 0; i < data.daily_datetime.length; i++) {
    dailyRange[i] = [data.daily_min[i], data.daily_max[i]];
  }

  // ----- Chart configuration --------------------------------

  let chartConfig = {
    accessibility: { enabled: false },
    chart: {
      animation: false,
    },
    plotOptions: {
      columnrange: {
        animation: false,
      },
    },
    title: {
      text: title,
      style: { color: "#333333", fontSize: "12px" },
    },
    xAxis: {
      categories: days,
      visible: false,
    },
    yAxis: {
      min: ymin,
      max: ymax,
      title: {
        text: "",
      },
      plotLines: pm25_AQILines(2),
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "Daily Range",
        type: "columnrange",
        data: dailyRange,
        color: "#bbb",
      },
      {
        name: "Daily Mean",
        type: "scatter",
        data: dailyMean,
        animation: false,
        // NOTE:  If the chart width specified in the component html is too small,
        // NOTE:  large symbols that would bump into each other will not be drawn.
        marker: {
          radius: 2,
          symbol: "circle",
          lineColor: "#333",
          lineWidth: 0.5,
        },
      },
    ],
  };

  return chartConfig;
}
