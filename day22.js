const { test, test2, data } = require('./data/day22');

const PARSE_REGEX = /(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)$/;
const parseInput = (input) => {
  const parsedInput = input.map((instruction) => {
    const [, direction, x1, x2, y1, y2, z1, z2] = instruction.match(PARSE_REGEX);
    const xStart = Math.min(Number(x1), Number(x2));
    const xEnd = Math.max(Number(x1), Number(x2));
    const yStart = Math.min(Number(y1), Number(y2));
    const yEnd = Math.max(Number(y1), Number(y2));
    const zStart = Math.min(Number(z1), Number(z2));
    const zEnd = Math.max(Number(z1), Number(z2));

    return {
      on: direction === 'on',
      xRange: [xStart, xEnd],
      yRange: [yStart, yEnd],
      zRange: [zStart, zEnd],
    };
  });

  return parsedInput;
};

const executeInstructions = (input) => {
  const onStates = input.reduce((agg, instruction) => {
    const { on, xRange, yRange, zRange} = instruction;

    if (
      (xRange[0] < -50 && xRange[1] < -50) ||
      (xRange[0] > 50 && xRange[1] > 50) ||
      (yRange[0] < -50 && yRange[1] < -50) ||
      (yRange[0] > 50 && yRange[1] > 50) ||
      (zRange[0] < -50 && zRange[1] < -50) ||
      (zRange[0] > 50 && zRange[1] > 50)
    ) {
      return agg;
    }

    for (i = xRange[0]; i <= xRange[1]; i++) {
      for (j = yRange[0]; j <= yRange[1]; j++) {
        for (k = zRange[0]; k <= zRange[1]; k++) {
          const key = [i, j, k].join();
          agg[key] = on;
        }
      }
    }

    return agg;
  }, {});

  return Object.values(onStates).filter(x => x).length;
};

const getCuboidOverlap = (cuboid1, cuboid2) => {
  const {
    xRange: [x11, x12],
    yRange: [y11, y12],
    zRange: [z11, z12],
  } = cuboid1;
  const {
    xRange: [x21, x22],
    yRange: [y21, y22],
    zRange: [z21, z22],
  } = cuboid2;

  if (
    (x11 <= x22 && x12 >= x21) &&
    (y11 <= y22 && y12 >= y21) &&
    (z11 <= z22 && z12 >= z21)
  ) {
    const xRange = [Math.max(x11, x21), Math.min(x12, x22)];
    const yRange = [Math.max(y11, y21), Math.min(y12, y22)];
    const zRange = [Math.max(z11, z21), Math.min(z12, z22)];

    return {
      xRange,
      yRange,
      zRange,
    };
  }

  return false;
};

const getVolumeOfOns = (input) => {
  const existingCuboids = [];
  for (instruction of input) {
    const { on, ...ranges } = instruction;
    const currentExistingCuboids = [...existingCuboids];
    for (current of currentExistingCuboids) {
      const overlappingCuboid = getCuboidOverlap(ranges, current);
      if (!overlappingCuboid) {
        continue;
      }

      existingCuboids.push({
        ...overlappingCuboid,
        multiplier: current.multiplier * -1,
      });
    }
    if (on) {
      existingCuboids.push({
        ...ranges,
        multiplier: 1,
      });
    }
  }

  return existingCuboids.reduce((sum, cuboid) => {
    const { xRange, yRange, zRange, multiplier } = cuboid;
    const xDist = Math.abs(xRange[1] - xRange[0]) + 1;
    const yDist = Math.abs(yRange[1] - yRange[0]) + 1;
    const zDist = Math.abs(zRange[1] - zRange[0]) + 1;

    return sum + (xDist * yDist * zDist * multiplier);
  }, 0);
};

console.log(executeInstructions(parseInput(test)));
console.log(executeInstructions(parseInput(test2)));
console.log(getVolumeOfOns(parseInput(test2)));
console.log(executeInstructions(parseInput(data)));
console.log(getVolumeOfOns(parseInput(data)));