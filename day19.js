const { test, data } = require('./data/day19');

const SCANNER_LINE = /--- scanner (\d+) ---/;
const parseInput = (input) => {
  let scanners = [];
  let currentScanner;
  for (element of input) {
    const matchesNextScanner = element.match(SCANNER_LINE);
    if (matchesNextScanner) {
      scanners.push([]);
      currentScanner = scanners.length - 1;
      continue;
    }

    scanners[currentScanner].push(element.split(',').map(Number));
  }

  return scanners;
};

const rotations = [
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [x, z, -y],
  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [x, -z, y],
  ([x, y, z]) => [-x, y, -z],
  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-x, z, y],
  ([x, y, z]) => [-x, -z, -y],
  ([x, y, z]) => [y, z, x],
  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [y, x, -z],
  ([x, y, z]) => [y, -z, -x],
  ([x, y, z]) => [-y, x, z],
  ([x, y, z]) => [-y, z, -x],
  ([x, y, z]) => [-y, -z, x],
  ([x, y, z]) => [-y, -x, -z],
  ([x, y, z]) => [z, x, y],
  ([x, y, z]) => [z, y, -x],
  ([x, y, z]) => [z, -y, x],
  ([x, y, z]) => [z, -x, -y],
  ([x, y, z]) => [-z, y, x],
  ([x, y, z]) => [-z, -x, y],
  ([x, y, z]) => [-z, x, -y],
  ([x, y, z]) => [-z, -y, -x],
];

const rotate = (scanner, rotation) => scanner.map(rotation);

const translate = (scanner, translation) => scanner.map((beacon) => (
  beacon.map((coord, idx) => coord + translation[idx])
));

const transform = (scanner, { rotation, translation }) => (
  translate(rotate(scanner, rotation), translation)
);

/**
 * Algorithm: create transform list from scanners
 *
 * Idea:
 * For each scanner, i, for each rotation, r, apply r to each of i's beacons, bi -> bi*
 *   For each other scanner, j, compute distance vectors for each beacon in bi* and bj
 *     if 12 similar distance vectors exist
 *       rot is the rotation from i to j, and the distance vector is the translation
 * Now, we have all of the pair-wise scanner overlap regions,
 *   but not all regions are directly connected to origin,
 *   so we need to find connected transforms to walk back to origin
 *
 * transforms = [
 *   [fromIdx (this scanner)]: {
 *     [toKey]: [
 *       { rotation, translation }
 *     ]
 *   }
 * ]
 *
 * // Get each scanner's overlaps
 * for each scanner, i
 *   for each other scanner, j
 *     for each rotation, rot
 *       apply rot to scanner i => scanner i*
 *       for each beacon b1* in scanner i*
 *         for each beacon b2 in scanner j
 *           compute each coordinate differences b2 - b1*
 *           add count to difference vector
 *           if have 12 matching difference vectors
 *             store rotation and difference vector in as first element in transform[i][j] array
 *               -- transform arrays will be how we apply transforms from disconnected observation cubes to reach 0
 *             move to next j for this i
 *
 * // Get each scanner's to-zero
 * while there's a transform [from] without a [to] 0
 *   for each transform without a [to] 0, j
 *     for each transform of j, k
 *       if k has a transform [to] 0
 *         set j's transform [to] 0 to be j->k->0
 *         we're done this path for now, break inner-most loop
 */
const findTransforms = (scanners) => {
  const transforms = scanners.map(() => ({}));

  for (let i = 0; i < scanners.length; i++) {
    if (i === 0) {
      // set scanner zero as the origin rotation
      transforms[i] = {
        [i]: [
          {
            rotation: rotations[i],
            translation: [0, 0, 0],
          },
        ],
      };
      continue;
    }

    // for each scanner, i
    const firstScanner = scanners[i];
    
    innerLoop:
    for (let j = 0; j < scanners.length; j++) {
      if (i === j) {
        continue;
      }

      // for each other scanner, j
      const secondScanner = scanners[j];
      for (const rotation of rotations) {
        // for each rotation, rot
        const differences = {};
        for (const beacon1 of firstScanner) {
          // apply rot to scanner i => scanner i*
          const [x1, y1, z1] = rotation(beacon1);
          // for each beacon b1* in scanner i*
          for (const beacon2 of secondScanner) {
            // for each beacon b2 in scanner j
            const [x2, y2, z2] = beacon2;

            // compute each coordinate differences b2 - b1*
            const diff = [x2 - x1, y2 - y1, z2 - z1];
            const diffStr = diff.join();

            // add count to difference vector
            if (!differences[diffStr]) {
              differences[diffStr] = 0;
            }
            differences[diffStr] += 1;
            
            if (differences[diffStr] === 12) {
              // store rotation and difference vector in as first element in transform[i][j] array
              transforms[i][j] = [
                {
                  rotation,
                  translation: diff,
                },
              ];

              // move to next j for this i
              continue innerLoop;
            }
          }
        }
      }
    }
  }

  // while there's a transform [from] without a [to] 0
  while (transforms.some(t => typeof t[0] === 'undefined')) {
    // for each transform without a [to] 0, j
    for (let i = 1; i < transforms.length; i++) {
      if (transforms[i][0]) {
        continue;
      }

      // for each transform of j, k
      for (let j in transforms[i]) {
        // if k has a transform [to] 0
        if (typeof transforms[j][0] === 'undefined') {
          continue;
        }

        // set j's transform [to] 0 to be j->k->0
        transforms[i][0] = transforms[i][j].concat(transforms[j][0]);
        // we're done this path for now, break inner-most loop
        break;
      }
    }
  }

  return transforms;
}

const findBeacons = (scanners) => {
  const transforms = findTransforms(scanners);

  const beacons = scanners
    .map((scanner, idx) => (
      transforms[idx][0]
        .reduce(transform, scanner)
        .map((beacon) => beacon.join(','))
    ))
    .reduce((agg, curr) => ({
      ...agg,
      ...curr.reduce((els, el) => ({ ...els, [el]: true }), {}),
      }), {});

  return { beacons, transforms };
};

const solve = (scanners) => {
  const { beacons, transforms } = findBeacons(scanners);
  const numBeacons = Object.keys(beacons).length;

  const scannerCoords = transforms.reduce((coords, transformBag, scannerIdx) => [
    ...coords,
    transformBag[0].reduce(transform, [[0, 0, 0]]),
  ], []).map(([el]) => el);

  let maxDistance = -Infinity;
  scannerCoords.forEach((first) => {
    scannerCoords.forEach((second) => {
      const currentDist = Math.abs(first[0] - second[0]) + Math.abs(first[1] - second[1]) + Math.abs(first[2] - second[2]);
      if (currentDist > maxDistance) {
        maxDistance = currentDist;
      }
    });
  });

  return {
    numBeacons,
    maxDistance,
  };
};

const parsedTest = parseInput(test);
const parsedData = parseInput(data);

console.log({
  test: solve(parsedTest),
  data: solve(parsedData),
});
