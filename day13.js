const { test, data } = require('./data/day13');

const foldRegex = /^fold along (x|y)=(\d+)$/;

const parseData = (input) => {
  return input.reduce((agg, curr) => {
    const fold = curr.match(foldRegex);
    if (fold) {
      const [, axis, line] = fold;
      return {
        ...agg,
        folds: [...agg.folds, { [axis]: Number(line) }],
      };
    }

    return {
      ...agg,
      points: [...agg.points, curr.split(',').map(Number)],
    };
  }, { points: [], folds: [] });
};

const executeFold = (points, fold) => {
  const newPoints = points.map(([x, y]) => {
    if (Object.keys(fold).includes('x')) {
      if (x > fold.x) {
        // a - (b - a) === 2 * a - b
        return [2 * fold.x - x, y]
      }
    }
    if (y > fold.y) {
      return [x, 2 * fold.y - y];
    }

    return [x, y];
  });

  return newPoints.filter(([x, y], idx, arr) => arr.findIndex(([xCandidate, yCandidate]) => `${x},${y}` === `${xCandidate},${yCandidate}`) === idx);
};

const parsedTest = parseData(test);
const parsedData = parseData(data);

console.log({ test: executeFold(parsedTest.points, parsedTest.folds[0]).length });
console.log({ data: executeFold(parsedData.points, parsedData.folds[0]).length });

// pt 2

const testPoints = parsedTest.folds.reduce(executeFold, parsedTest.points);
const points = parsedData.folds.reduce(executeFold, parsedData.points);

const drawPoints = (arrayOfPoints) => {
  const xs = arrayOfPoints.map(([x]) => x);
  const ys = arrayOfPoints.map(([, y]) => y);

  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  const display = Array.from({ length: maxY + 1 }, () => Array.from({ length: maxX + 1 }, () => ' '));

  arrayOfPoints.forEach(([x, y]) => {
    display[y][x] = 'X';
  });

  console.log(display.map(row => row.join('')).join('\n'));
};

console.log('\npt 2\n\ntest');
drawPoints(testPoints);
console.log('--------\ndata');
drawPoints(points);
