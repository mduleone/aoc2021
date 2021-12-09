const { data, test } = require('./data/day9');

const parseData = (input) => (
  input.map((line) => line.split('').map(Number))
);

const getAdjacents = (x, y, grid, horizontal) => (
  horizontal
    ? [x - 1, x, x + 1].filter(el => el >= 0 && el <= grid[0].length - 1)
    : [y - 1, y, y + 1].filter(el => el >= 0 && el <= grid.length - 1)
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
        lowPoints.push({ point: col, x: j, y: i });
      }
    })
  });

  return lowPoints;
};

const getRiskLevel = (input) => (
  findLowPoints(input).reduce((sum, { point: t }) => sum + t + 1, 0)
);

// @TODO: is this signature correct??? I can recurse with this, but do I want to?
const getBasinFromLowPoint = (lowPoint, grid, currentBasin, checked) => {
//   const { x, y } = lowPoint;
//   const horizontalAdjacent = getAdjacents(x, y, grid, true);
//   const verticalAdjacent = getAdjacents(x, y, grid);

//   const basinCandidates = [];

//   for (let i = 0; i < verticalAdjacent.length; i++) {
//     for (let j = 0; j < horizontalAdjacent.length; j++) {
//       const candidateY = verticalAdjacent[i];
//       const candidateX = horizontalAdjacent[j];
//       if (candidateY !== y && candidateX !== x) {
//         continue;
//       }
//       if (candidateY === y && candidateX === x) {
//         continue;
//       }
//       if (grid[candidateY][candidateX] === 9) {
//         continue;
//       }
//       if (!basinCandidates.find(el => el.x === candidateX && el.y === candidateY) && !checked.find(el => el.x === candidateX && el.y === candidateY)) {
//         basinCandidates.push({ x: candidateX, y: candidateY, point: grid[candidateY][candidateX] });
//       }
//     }
//   }
//   checked.push(lowPoint);
}

const getThreeLargestBasins = (grid) => {
  const lowPoints = findLowPoints(grid);

  return lowPoints.map((low) => getBasinFromLowPoint(low, grid, [], [])).sort((a, b) => b - a).slice(0, 3);
}

const getThreeLargestBasinsProduct = (grid) => (
  getThreeLargestBasins(grid).reduce((prod, x) => prod * x, 1)
);

const parsedTest = parseData(test);
const parsedData = parseData(data);

// console.log(findLowPoints(parsedTest));
// console.log(getRiskLevel(parsedTest));
// console.log(determineIfLowPoint(9, 0, parsedTest));

// console.log(data.map(datum => datum.replace(/9/g, '+')));

console.log({
  test: {
    a: getRiskLevel(parsedTest), // 15
    b: getThreeLargestBasinsProduct(parsedTest), // 1134
  },
  data: {
    a: getRiskLevel(parsedData), // 494
    b: getThreeLargestBasinsProduct(parsedData), // ??
  },
})