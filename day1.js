const { readings } = require('./data/day1');

const countIncreasingValues = (agg, curr, i, arr) => {
  if (i === 0) {
    return agg;
  }

  if (arr[i-1] < curr) {
    return agg + 1;
  }

  return agg;
};

const straight = readings.reduce(countIncreasingValues, 0);

const byThrees = readings.map((el, i, arr) => {
  if (i >= arr.length - 2) {
    return false;
  }

  return el + arr[i + 1] + arr[i + 2];
}).filter(el => el).reduce(countIncreasingValues, 0)

console.log({ straight, byThrees });
