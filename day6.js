const { data, test } = require('./data/day6');

const parseData = (input) => {
  const [str] = input;
  const nums = str.split(',');

  return nums.map(Number);
}

const SPAWN_REGEN_DELAY = 7;
const INITIAL_SPAWN_DELAY = 9;

const runSimulation = (input, days = 256) => {
  const spawnsOnDay = Array.from({ length: days }, () => 0);
  const fishes = Array.from({ length: INITIAL_SPAWN_DELAY }, () => 0);

  input.forEach(fishTimer => {
    fishes[fishTimer] += 1;
    spawnsOnDay[fishTimer] += 1;
  });

  spawnsOnDay[0] = input.length;

  for (let i = 1; i < days; i++) {
    if (i + SPAWN_REGEN_DELAY < days) {
      spawnsOnDay[i + SPAWN_REGEN_DELAY] += spawnsOnDay[i];
    }
    if (i + INITIAL_SPAWN_DELAY < days) {
      spawnsOnDay[i + INITIAL_SPAWN_DELAY] += spawnsOnDay[i]
    }
  }

  return spawnsOnDay.reduce((sum, fish) => sum + fish);
};

const parsedData = parseData(data);

console.log({ eighty: runSimulation(parsedData, 80), twoFiftySix: runSimulation(parsedData) });
