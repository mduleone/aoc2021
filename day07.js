const { data, test } = require('./data/day07');

const parseData = (input) => {
  const [str] = input;
  const nums = str.split(',');

  return nums.map(Number);
};

const parsedData = parseData(data);
const parsedTest = parseData(test);

const sumOneToN = num => (num * (num + 1) / 2);

const determineFuelConsumptionByIdx = (input, cell, static) => {
  return input.map(x => {
    const distance = Math.abs(x - cell);

    return static ? distance : sumOneToN(distance);
  }).reduce((sum, x) => sum + x, 0);
};

const determineFuelConsumption = (input, static = false) => {
  const max = Math.max(...input);
  const min = Math.min(...input);

  return Array.from({ length: max - min + 1 }, (_, idx) => min + idx).map((cell) => determineFuelConsumptionByIdx(input, cell, static));
}

const determineMinFuelConsumption = (input, static = false) => {
  const fuelConsumptionArray = determineFuelConsumption(input, static);
  const min = Math.min(...fuelConsumptionArray);

  const [idx, cost] = Object.entries(fuelConsumptionArray).find(([_, cost]) => cost === min);

  return { idx, cost };
};

console.log({
  test: {
    minFuelStatic: determineMinFuelConsumption(parsedTest, true),
    minFuel: determineMinFuelConsumption(parsedTest),
  },
  data: {
    minFuelStatic: determineMinFuelConsumption(parsedData, true),
    minFuel: determineMinFuelConsumption(parsedData),
  },
});
