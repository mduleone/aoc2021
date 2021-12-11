const { data, test } = require('./data/day05');

const LINE_SEGMENT_REGEX = /(\d+),(\d+)\s->\s(\d+),(\d+)/;

const parseLine = (lineStringSegment) => {
  const [, a, b, c, d] = lineStringSegment.match(LINE_SEGMENT_REGEX);
  const [x1, y1, x2, y2] = [a, b, c, d].map(Number);

  return { x1, y1, x2, y2 };
};

const addLineToMap = (pointOverlap, { x1, x2, y1, y2 }) => {
  const startingPointX = x1;
  const startingPointY = y1;
  let xMult = 0;
  let yMult = 0;
  if (x1 !== x2) {
    xMult = x2 < x1 ? -1 : 1;
  }
  if (y1 !== y2) {
    yMult = y2 < y1 ? -1 : 1;
  }
  const length = (yMult === 0 ? Math.abs(x1 - x2) : Math.abs(y1 - y2)) + 1;

  return Array.from({ length }).reduce((points, _, idx) => {
    const point = `${startingPointX + (idx * xMult)},${startingPointY + (idx * yMult)}`;
    if (typeof points[point] === 'undefined') {
      points[point] = 0;
    }

    points[point] += 1;

    return points;
  }, pointOverlap);
};

const getMultiLineVentCount = (data, allowDiagonals) => {
  const ventPointCountList = data
    .map(parseLine)
    .filter(({ x1, y1, x2, y2 }) => allowDiagonals || x1 === x2 || y1 === y2)
    .reduce(addLineToMap, {});

  return Object.values(ventPointCountList).filter(count => count > 1).length;
};

console.log({
  test: {
    horizontalAndVerticalsOnly: getMultiLineVentCount(test, false),
    allLines: getMultiLineVentCount(test, true),
  },
  data: {
    horizontalAndVerticalsOnly: getMultiLineVentCount(data, false),
    allLines: getMultiLineVentCount(data, true),
  },
});
