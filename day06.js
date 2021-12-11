const { data, test } = require('./data/day06');

const parseData = (input) => {
  const [str] = input;
  const nums = str.split(',');

  return nums.map(Number);
};

const SPAWN_REGEN_DELAY = 7;
const INITIAL_SPAWN_DELAY = 9;

const runSimulation = (input, days = 256) => {
  const spawnsOnDay = Array.from({ length: days }, () => 0);

  input.forEach(fishTimer => {
    spawnsOnDay[fishTimer] += 1;
  });

  spawnsOnDay.unshift(input.length);
  for (let i = 1; i < days + 1; i++) {
    if (i + SPAWN_REGEN_DELAY < days + 1) {
      spawnsOnDay[i + SPAWN_REGEN_DELAY] += spawnsOnDay[i];
    }
    if (i + INITIAL_SPAWN_DELAY < days + 1) {
      spawnsOnDay[i + INITIAL_SPAWN_DELAY] += spawnsOnDay[i];
    }
  }

  return spawnsOnDay.reduce((sum, fish) => sum + fish);
};

const parsedData = parseData(data);
const parsedTest = parseData(test);

console.log({
  test: { eighty: runSimulation(parsedTest, 80), twoFiftySix: runSimulation(parsedTest) },
  data: { eighty: runSimulation(parsedData, 80), twoFiftySix: runSimulation(parsedData) },
});
