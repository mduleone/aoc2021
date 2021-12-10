const { data: report } = require('./data/day3');

const countBits = (arrOfBinaryNumbers) => (
  arrOfBinaryNumbers
    .reduce(
      (bitCount, curr) => bitCount.map((bit, i) => bit + Number(curr[i])),
      Array.from(arrOfBinaryNumbers[0], () => 0),
    )
);
const countBitsAtIndex = (arrOfStrings, idx) => countBits(arrOfStrings)[idx];

const generatePowerConsumption = (data, preferOn) => {
  const len = data.length;
  const bits = countBits(data);
  const [winner, loser] = preferOn
    ? ['1', '0']
    : ['0', '1'];

  return bits.map((bitCount) => bitCount > len - bitCount ? winner : loser).join('');
};

const gamma = generatePowerConsumption(report, true);
const epsilon = generatePowerConsumption(report, false);
const g = parseInt(gamma, 2);
const e = parseInt(epsilon, 2);

console.log({ gamma, epsilon, g, e, gxe: g * e });

const generateLifeSupport = (data, preferMostCommon) => {
  let commonBits;
  let filteredData = [...data];
  let idx = 0;
  while (filteredData.length !== 1) {
    const len = filteredData.length;
    commonBits = countBitsAtIndex(filteredData, idx);
    const mostCommon = commonBits >= len - commonBits ? '1' : '0';
    const leastCommon = commonBits >= len - commonBits ? '0' : '1';

    filteredData = filteredData.filter((el) => (
      preferMostCommon
        ? el[idx] === mostCommon
        : el[idx] === leastCommon
    ));

    idx++;
  }

  return filteredData;
};

const [oxygen] = generateLifeSupport(report, true);
const [co2] = generateLifeSupport(report, false);
const o = parseInt(oxygen, 2);
const c = parseInt(co2, 2);

console.log({ oxygen, co2, o, c, oxc: o * c });
