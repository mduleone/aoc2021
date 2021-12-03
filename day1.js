const { data: readings } = require('./data/day1');

const countIncreasingValues = (agg, _, i, arr) => {
  if (i === 0) {
    return agg;
  }

  if (arr[i - 1] < arr[i]) {
    return agg + 1;
  }

  return agg;
};

const generateRunningAverageByN = (arr, n) => (
  arr
    .map((el, i, arr) => {
      if (i < n - 1) {
        return false;
      }

      return arr
        .slice(i - (n - 1), i + 1)
        .reduce((agg, curr) => agg + curr, 0);
    })
    .filter(el => el)
)

const straight = readings.reduce(countIncreasingValues, 0);

const byThrees = generateRunningAverageByN(readings, 3).reduce(countIncreasingValues, 0)

console.log({ straight, byThrees });
