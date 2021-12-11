const { test, data } = require('./data/day11');

const parseInput = (input) => input
  .map(str => str.split('').map(Number));

const getExplodeList = (next, exploded = []) => next
  .reduce(
    (agg, currRow, rowIdx) => [
      ...agg,
      ...currRow
        .map((nextPower, colIdx) => (
          (nextPower > 9 && !exploded.find(([x, y]) => colIdx === x && rowIdx === y))
            ? [colIdx, rowIdx]
            : false
        ))
        .filter(el => el),
    ],
    [],
  );

const advanceStep = (input) => {
  let next = input.map((row) => row.map(el => el + 1));
  let exploded = [];
  let toExplode = getExplodeList(next, exploded);

  while (toExplode.length > 0) {
    toExplode.forEach(([x, y]) => {
      // up-left
      if (y > 0 && x > 0) {
        next[y - 1][x - 1] += 1;
      }

      // up
      if (y > 0) {
        next[y - 1][x] += 1;
      }

      // up-right
      if (y > 0 && x < next[0].length - 1) {
        next[y - 1][x + 1] += 1;
      }
      
      // right
      if (x < next[0].length - 1) {
        next[y][x + 1] += 1;
      }

      // down-right
      if (y < next.length - 1 && x < next[0].length - 1) {
        next[y + 1][x + 1] += 1;
      }
      
      // down
      if (y < next.length - 1) {
        next[y + 1][x] += 1;
      }
      
      // down-left
      if (y < next.length - 1 && x !== 0) {
        next[y + 1][x - 1] += 1;
      }
      
      // left
      if (x > 0) {
        next[y][x - 1] += 1;
      }

      exploded = [...exploded, [x, y]];
    });

    toExplode = getExplodeList(next, exploded);
  }

  next = next.map((row) => row.map((cell) => cell > 9 ? 0 : cell));

  return {
    next,
    exploded,
  };
};

const stepNDays = (starting, n) => Array.from({ length: n })
  .reduce((agg) => (
    [...agg, advanceStep(agg[agg.length - 1].next)]
  ), [{ next: starting, exploded: [] }])
  .map(({ exploded }) => exploded.length);

console.log({
  test: {
    hundred: stepNDays(parseInput(test), 100).reduce((sum, x) => sum + x, 0),
    firstAllFlash: stepNDays(parseInput(test), 1000).indexOf(100),
  },
  data: {
    hundred: stepNDays(parseInput(data), 100).reduce((sum, x) => sum + x, 0),
    firstAllFlash: stepNDays(parseInput(data), 1000).indexOf(100),
  },
});
