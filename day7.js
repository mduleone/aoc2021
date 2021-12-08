const { data, test } = require('./data/day7');

const parseData = (input) => {
  const [str] = input;
  const nums = str.split(',');

  return nums.map(Number);
}

const parsedData = parseData(data);

const sumOneToN = num => (num * (num + 1) / 2);

const determineFuelConsumptionByIdx = (data, cell, static) => {
  return data.map(x => static ? Math.abs(x - cell) : sumOneToN(Math.abs(x - cell))).reduce((sum, x) => sum + x, 0);
};

const determineFuelConsumption = (input, static = false) => {
  const max = Math.max(...input);
  const min = Math.min(...input);

  return Array.from({ length: max - min + 1 }, (_, idx) => min + idx).map((cell) => determineFuelConsumptionByIdx(input, cell, static));
}

console.log({
  fuelArrayStatic: Math.min(...determineFuelConsumption(parsedData, true)),
  fuelArray: Math.min(...determineFuelConsumption(parsedData)),
});