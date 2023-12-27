const fs = require('fs');
const lodash = require('lodash');

const raw_data = fs.readFileSync('heartrate.json');
const heartBeatData = JSON.parse(raw_data);

const groupedData = lodash.groupBy(heartBeatData, (data) => data.timestamps.startTime.split('T')[0]);

const result = [];


function calculateMedian(data) {
    const sorted_data = lodash.sortBy(data, (item) => item.beatsPerMinute);
    const len = sorted_data.length;
    if (len % 2 === 0) {
      const mid1 = sorted_data[len / 2 - 1].beatsPerMinute;
      const mid2 = sorted_data[len / 2].beatsPerMinute;
      return (mid1 + mid2) / 2;
    } else {
      return sorted_data[Math.floor(len / 2)].beatsPerMinute;
    }
  }
  

for (const date in groupedData) {
  if (groupedData.hasOwnProperty(date)) {
    const day_data = groupedData[date];

    const min = lodash.minBy(day_data, (data) => data.beatsPerMinute).beatsPerMinute;
    const max = lodash.maxBy(day_data, (data) => data.beatsPerMinute).beatsPerMinute;
    const median = calculateMedian(day_data);

    const latestData = lodash.maxBy(day_data, (data) => new Date(data.timestamps.startTime));

    result.push({
      date: date,
      min: min,
      max: max,
      median: median,
      latestDataTimestamp: latestData.timestamps.startTime,
    });
  }
}

const sortedResult = lodash.sortBy(result, (entry) => entry.date);

fs.writeFileSync('output.json', JSON.stringify(sortedResult, null, 2), 'utf8');

console.log('Statistics calculated and saved to output.json.');
