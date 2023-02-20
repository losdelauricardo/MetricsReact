import React from 'react';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

var labels = []
// Timeline by day
//option for the day timeline
export const options = {
  minutes: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'The metrics by Minutes',
      },
    },
  },
  hours: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'The metrics by hours',
      },
    },
  },
  days: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'The metrics by day',
      },
    },
  },
}

let chartLabels = {
  minutes: [],
  hours: [],
  days: []
};
let chartValues = {
  minutes: [],
  hours: [],
  days: []
};
//get minute timeline from api
axios.get(`http://127.0.0.1:3000/api/metrics/timeline/minute`)
  .then(res => {
    var metrics = res.data;
    for (const key in metrics) {
      if (Object.hasOwnProperty.call(metrics, key)) {
        chartLabels.minutes.push((metrics[key].minute + "").substring(0, 16));
        chartValues.minutes.push(metrics[key].value);
      }
    }
  })
//get day timeline from api
axios.get(`http://127.0.0.1:3000/api/metrics/timeline/day`)
  .then(res => {
    var metrics = res.data;
    for (const key in metrics) {
      if (Object.hasOwnProperty.call(metrics, key)) {
        chartLabels.days.push((metrics[key].day + "").substring(0, 10));
        chartValues.days.push(metrics[key].value);
      }
    }
  })
//get hours timeline from api
axios.get(`http://127.0.0.1:3000/api/metrics/timeline`)
  .then(res => {
    var metrics = res.data;
    for (const key in metrics) {
      if (Object.hasOwnProperty.call(metrics, key)) {
        chartLabels.hours.push((metrics[key].hour + "").substring(0, 16));
        chartValues.hours.push(metrics[key].value);
      }
    }
  })

  // Data for minutes
labels = chartLabels.minutes;
export const dataMinute = {
  labels,
  datasets: [
    {
      label: 'Metrics',
      data: chartValues.minutes,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ]
};
  // Data for hours
labels = chartLabels.hours;
export const dataHour = {
  labels,
  datasets: [
    {
      label: 'Metrics',
      data: chartValues.hours,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ]
};

// data for days
labels = chartLabels.days;
export const dataDay = {
  labels,
  datasets: [
    {
      label: 'Metrics',
      data: chartValues.days,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ]
};
// end timeline by day





const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];



function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    // Adding leading zero to minutes
    minutes = `0${minutes}`;
  }

  if (prefomattedDate) {
    // Today at 10:20
    // Yesterday at 10:20
    return `${prefomattedDate} at ${hours}:${minutes}`;
  }

  if (hideYear) {
    // 10. January at 10:20
    return `${day}. ${month} at ${hours}:${minutes}`;
  }

  // 10. January 2017. at 10:20
  return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
}


// --- Main function
function timeAgo(dateParam) {
  if (!dateParam) {
    return null;
  }

  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
  const today = new Date();
  const yesterday = new Date(today - DAY_IN_MS);
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const isToday = today.toDateString() === date.toDateString();
  const isYesterday = yesterday.toDateString() === date.toDateString();
  const isThisYear = today.getFullYear() === date.getFullYear();


  if (seconds < 5) {
    return 'now';
  } else if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (seconds < 90) {
    return 'about a minute ago';
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (isToday) {
    return getFormattedDate(date, 'Today'); // Today at 10:20
  } else if (isYesterday) {
    return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
  } else if (isThisYear) {
    return getFormattedDate(date, false, true); // 10. January at 10:20
  }

  return getFormattedDate(date); // 10. January 2017. at 10:20
}



export default class MetricsList extends React.Component {
  state = {
    metrics: []
  }

  componentDidMount() {
    axios.get(`http://127.0.0.1:3000/api/metrics`)
      .then(res => {
        const metrics = res.data;
        this.setState({ metrics });
      })

    console.log("Hello world")
  }


  render() {
    return (
      <>
        <div className='container'>
          <Line options={options.minutes} data={dataMinute} />
          <Line options={options.hours} data={dataHour} />
          <Line options={options.days} data={dataDay} />
          {/* <Line options={optionsDay} data={dataDay} /> */}
          <div class="list-group w-auto">
            {
              this.state.metrics
                .map(metric =>
                  <a key={metric.id} href="#" className="list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                    <img src="https://github.com/twbs.png" alt="twbs" width="32" height="32" class="rounded-circle flex-shrink-0"></img>
                    <div class="d-flex gap-2 w-100 justify-content-between">
                      <div>
                        <h6 className='mb-0'>{metric.name}</h6>
                        <p class="mb-0 opacity-75">{metric.value}.</p>
                      </div>
                      {/* <small class="opacity-50 text-nowrap">now</small> */}
                      <small class="opacity-50 text-nowrap">{timeAgo(metric.created_at)}</small>
                    </div>
                  </a>
                )
            }

          </div>
        </div>
        {/*       
        <ul>
          {
            this.state.metrics
              .map(metric =>
                <li key={metric.id}>{metric.name}</li>
              )
          }
        </ul> */}
      </>
    )
  }
}