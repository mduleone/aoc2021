const { data, test } = require('./data/day17');

const TARGET_REGEX = /target area: x=(\d+)..(\d+), y=-(\d+)..-(\d+)/;

const parseInput = (input) => {
  const [_, x1, x2, y2, y1] = input.match(TARGET_REGEX);

  return { x1: +x1, x2: +x2, y1: -y1, y2: -y2 };
};

const step = ({ position: [xPos, yPos], velocity: [xVel, yVel] }) => {
  const xVelPos = xVel >= 0;
  let nextXVel = (Math.abs(xVel) - 1) * (xVelPos ? 1 : -1);
  if (xVel === 0) {
    nextXVel = 0;
  }

  return {
    position: [xPos + xVel, yPos + yVel],
    velocity: [nextXVel, yVel - 1],
  };
};

const computeTrajectory = (initialVelocity, target) => {
  let position = [0, 0];
  let velocity = initialVelocity;

  let steps = 0;
  let maxY = -Infinity;
  let inRange = false;
  while (!inRange && position[0] <= target.x2 && position[1] >= target.y2) {
    ({ position, velocity } = step({ position, velocity }));
    steps += 1;

    if (maxY < position[1]) {
      maxY = position[1];
    }

    if (
      position[0] >= target.x1
        && position[0] <= target.x2
        && position[1] <= target.y1
        && position[1] >= target.y2
    ) {
      inRange = true;
    }
  }

  return { inRange, initialVelocity, position, steps, maxY };
};

const findShotsToShoot = (parsedInput) => {
  const candidates = [];
  for (let i = 0; i < 233; i++) {
    for (let j = -124; j < 125; j++) {
      candidates.push([i, j]);
    }
  }

  const fireProbe = (velocity) => computeTrajectory(velocity, parsedInput);

  const inRangeShots = candidates.map(fireProbe).filter(x => x.inRange);
  const [highest] = inRangeShots.sort((a, b) => b.maxY - a.maxY);

  return {
    'highest height (a)': highest.maxY,
    'totalShots (b)': inRangeShots.length,
  };
};

const parsedTest = parseInput(...test);
const parsedData = parseInput(...data);

console.log({
  test: findShotsToShoot(parsedTest),
  data: findShotsToShoot(parsedData),
});
