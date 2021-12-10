const { data, test } = require('./data/day9');

const parseData = (input) => (
  input.map((line) => line.split('').map(Number))
);

const getAdjacents = (x, y, grid, horizontal) => (
  horizontal
    ? [x - 1, x, x + 1].filter(el => el >= 0 && el < grid[0].length)
    : [y - 1, y, y + 1].filter(el => el >= 0 && el < grid.length)
);

const determineIfLowPoint = (x, y, grid) => {
  const horizontalAdjacent = getAdjacents(x, y, grid, true);
  const verticalAdjacent = getAdjacents(x, y, grid);
  const notLessThanAdjacents = [];
  const point = grid[y][x];

  for (let i = 0; i < verticalAdjacent.length; i++) {
    for (let j = 0; j < horizontalAdjacent.length; j++) {
      const candidateY = verticalAdjacent[i];
      const candidateX = horizontalAdjacent[j];
      const candidatePoint = grid[candidateY][candidateX];
      // No diagonals
      if (candidateY !== y && candidateX !== x) {
        continue;
      }

      if (candidatePoint < point) {
        return false;
      }
      notLessThanAdjacents.push(candidatePoint);
    }
  }

  // Check for plateau
  if (notLessThanAdjacents.every(t => t === point)) {
    return false;
  }

  return true;
}

const findLowPoints = (input) => {
  let lowPoints = [];
  input.forEach((row, i) => {
    row.forEach((col, j) => {
      if (determineIfLowPoint(j, i, input)) {
        lowPoints.push({ point: col, x: j, y: i , toString: () => `${j},${i}` });
      }
    })
  });

  return lowPoints;
};

const getRiskLevel = (input) => (
  findLowPoints(input).reduce((sum, { point: t }) => sum + t + 1, 0)
);

const arrayUnique = (array) => {
  const uniqueStrs = Object.values(array).map(el => el.toString()).filter((value, idx, arr) => arr.indexOf(value) === idx);

  return uniqueStrs.map(str => array.find(el => el.toString() === str));
}

const getBasinFromLowPoint = (lowPoint, grid, visited = []) => {
  const { x, y, point } = lowPoint;

  const basinCandidates = [];

  if (visited.some(el => el.x === x && el.y === y)) {
    return basinCandidates;
  }

  // up
  if (y !== 0) {
    if (grid[y - 1][x] !== 9 && grid[y - 1][x] >= point) {
      basinCandidates.push({ point: grid[y - 1][x], x, y: y - 1, toString: () => `${x},${y - 1}` });
    }
  }

  // right
  if (x < grid[0].length - 1) {
    if (grid[y][x + 1] !== 9 && grid[y][x + 1] >= point) {
      basinCandidates.push({ point: grid[y][x + 1], x: x + 1, y, toString: () => `${x + 1},${y}` });
    }
  }

  // down
  if (y < grid.length - 1) {
    if (grid[y + 1][x] !== 9 && grid[y + 1][x] >= point) {
      basinCandidates.push({ point: grid[y + 1][x], x, y: y + 1, toString: () => `${x},${y + 1}` });
    }
  }

  // left
  if (x !== 0) {
    if (grid[y][x - 1] !== 9 && grid[y][x - 1] >= point) {
      basinCandidates.push({ point: grid[y][x - 1], x: x - 1, y, toString: () => `${x - 1},${y}` });
    }
  }

  return arrayUnique([
    lowPoint,
    ...(
      []
        .concat(
          ...basinCandidates.map(candidate => getBasinFromLowPoint(candidate, grid, [...visited, lowPoint]))
        )
    )
  ]);
};

const getThreeLargestBasins = (grid) => {
  const lowPoints = findLowPoints(grid);

  return lowPoints
    .map((low, idx, arr) => {
      const basin = getBasinFromLowPoint(low, grid)
      console.log(`${idx + 1}/${arr.length}: ${basin.length}`);
      return basin;
    })
    .map(arr => arr.length)
    .sort((a, b) => b - a)
    .slice(0, 3);
}

const getThreeLargestBasinsProduct = (grid) => (
  getThreeLargestBasins(grid).reduce((prod, x) => prod * x, 1)
);

const parsedTest = parseData(test);
const parsedData = parseData(data);

console.log({
  test: {
    a: getRiskLevel(parsedTest),
    b: getThreeLargestBasinsProduct(parsedTest),
  },
  data: {
    a: getRiskLevel(parsedData),
    b: getThreeLargestBasinsProduct(parsedData),
  },
});
