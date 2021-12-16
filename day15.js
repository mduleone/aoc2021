const { data, test } = require('./data/day15');

const parseInput = (input) => {
  return input.map((row) => row.split('').map(Number));
};

const getShortestNode = (unvisitedDistances, visited) => {
  return Object.entries(unvisitedDistances)
    .reduce((currentShortest, [nextKeys, nextDistance]) => {
      let currentIsShortest = currentShortest.point === null || nextDistance < currentShortest.distance;

      if (currentIsShortest && !visited[nextKeys]) {
        return { point: nextKeys.split(',').map(Number), distance: nextDistance };
      }

      return currentShortest;
    }, { point: null, distance: Infinity });
}

const findShortestPath = (map) => {
  const visited = {};
  const xLen = map[0].length;
  const yLen = map.length;
  const unvisitedDistances = {};

  const start = [0, 0];
  unvisitedDistances[String(start)] = 0;
  const dest = [xLen - 1, yLen - 1];
  let currentNode = {
    point: start,
    distance: unvisitedDistances[String(start)],
  };
  let i = 0;

  while (!visited[String(dest)]) {
    const { point: [pX, pY], distance: d } = currentNode;
    const unvisitedNeighbors = [];
    // right
    if (pX < xLen - 1) {
      if (!visited[`${pX + 1},${pY}`]) {
        unvisitedNeighbors.push([pX + 1, pY]);
      }
    }
    // down
    if (pY < yLen - 1) {
      if (!visited[`${pX},${pY + 1}`]) {
        unvisitedNeighbors.push([pX, pY + 1]);
      }
    }
    // left
    if (pX > 0) {
      if (!visited[`${pX - 1},${pY}`]) {
        unvisitedNeighbors.push([pX - 1, pY]);
      }
    }
    // up
    if (pY > 0) {
      if (!visited[`${pX},${pY - 1}`]) {
        unvisitedNeighbors.push([pX, pY - 1]);
      }
    }
    
    unvisitedNeighbors.forEach(([cX, cY]) => {
      const nextLen = d + map[cY][cX];
      if (typeof unvisitedDistances[String([cX, cY])] === 'undefined' || nextLen < unvisitedDistances[String([cX, cY])]) {
        unvisitedDistances[String([cX, cY])] = nextLen;
      }
    });

    visited[String(currentNode.point)] = true;
    if (String(currentNode.point) === String(dest)) {
      return currentNode.distance;
    }
    delete unvisitedDistances[String(currentNode.point)];
    const nextMinPoint = getShortestNode(unvisitedDistances, visited);

    currentNode = nextMinPoint;
    i++;
    if (i % 5000 === 0) {
      console.log({ i, currentNode: String(currentNode.point)});
    }
  }
  
  return Infinity;
};

const ADVANCE = {
  '1': '2',
  '2': '3',
  '3': '4',
  '4': '5',
  '5': '6',
  '6': '7',
  '7': '8',
  '8': '9',
  '9': '1',
};

const applyAdvanceNTimes = (start, count) => (
  Array.from({ length: count }).reduce((agg) => ADVANCE[agg], start)
);

const turnInputIntoInputTimes5 = (input) => {
  const expandedInX = input
    .map(
      (row) => Array
        .from({ length: 5 }, () => row.split(''))
        .reduce((agg, curr) => [...agg, ...curr], [])
        .map((el, idx) => applyAdvanceNTimes(el, Math.floor(idx / input[0].length)))
    );
    
  const expandedInY = Array.from({ length: 5 }, () => expandedInX)
    .reduce((agg, curr) => [...agg, ...curr], [])
    .map((row, idx) => row.map((el) => applyAdvanceNTimes(el, Math.floor(idx / input.length))).join(''))

  return expandedInY;
};

const dist1 = findShortestPath(parseInput(data));
console.log(dist1);

const dist2 = findShortestPath(parseInput(turnInputIntoInputTimes5(data)));
console.log(dist2);
