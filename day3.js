const { data: report } = require('./data/day3');

const countBits = (arrOfBinaryNumbers) => (
  arrOfBinaryNumbers
    .reduce(
      (bitCount, curr) => (
        bitCount.map(({ one, zero }, i) => (
          (curr[i] === '0')
            ? { one, zero: zero + 1 }
            : { one: one + 1, zero }
        ))
      ),
      Array.from(arrOfBinaryNumbers[0], () => ({ one: 0, zero: 0 })),
    )
);
const countBitsAtIndex = (arrOfStrings, idx) => countBits(arrOfStrings)[idx];

const generatePowerConsumption = (data, leanHeavy) => {
  const bits = countBits(data);
  const winner = leanHeavy ? '1' : '0';
  const loser = leanHeavy ? '0' : '1';

  return bits.map((bit) => bit.one > bit.zero ? winner : loser).join('');
};

const gamma = generatePowerConsumption(report, true);
const epsilon = generatePowerConsumption(report, false);
const g = parseInt(gamma, 2);
const e = parseInt(epsilon, 2);

console.log({ gamma, epsilon, g, e, gxe: g * e });

const generateLifeSupport = (data, leanHeavy) => {
  let commonBits;
  let filteredData = [...data];
  let idx = 0;
  while (filteredData.length !== 1) {
    commonBits = countBitsAtIndex(filteredData, idx);
    const mostCommon = commonBits.one >= commonBits.zero ? '1' : '0';
    const leastCommon = commonBits.one >= commonBits.zero ? '0' : '1';

    filteredData = filteredData.filter(el => (
      leanHeavy
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
