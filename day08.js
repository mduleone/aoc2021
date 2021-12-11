const { data, test } = require('./data/day08');

const sortString = str => str.split('').sort().join('');

const parseLine = (line) => {
  const [prefix, output] = line.split(' | ');
  const prefixCharacters = prefix.split(' ');
  const outputCharacters = output.split(' ');

  return { prefix: prefixCharacters.map(sortString), output: outputCharacters.map(sortString) };
};

const parseInput = (input) => input.map(parseLine);

const countOneFourSevenEight = (parsedOutputChars) => (
  parsedOutputChars.map((charArray) => (
    charArray.reduce((agg, curr) => [2, 3, 4, 7].includes(curr.length) ? agg + 1 : agg, 0)
  )).reduce((sum, x) => sum + x)
);

/*
 *   0:      1:      2:      3:      4:
 *  aaaa    ....    aaaa    aaaa    ....
 * b    c  .    c  .    c  .    c  b    c
 * b    c  .    c  .    c  .    c  b    c
 *  ....    ....    dddd    dddd    dddd
 * e    f  .    f  e    .  .    f  .    f
 * e    f  .    f  e    .  .    f  .    f
 *  gggg    ....    gggg    gggg    ....
 * 
 *   5:      6:      7:      8:      9:
 *  aaaa    aaaa    aaaa    aaaa    aaaa
 * b    .  b    .  .    c  b    c  b    c
 * b    .  b    .  .    c  b    c  b    c
 *  dddd    dddd    ....    dddd    dddd
 * .    f  e    f  .    f  e    f  .    f
 * .    f  e    f  .    f  e    f  .    f
 *  gggg    gggg    ....    gggg    gggg
 */

const getNumberDict = (linePrefix) => {
  const [one] = linePrefix.filter(el => el.length === 2);
  const [four] = linePrefix.filter(el => el.length === 4);
  const [seven] = linePrefix.filter(el => el.length === 3);
  const [eight] = linePrefix.filter(el => el.length === 7);

  const oneSplit = one.split('');
  const sixLen = linePrefix.filter(el => el.length === 6);
  const fiveLen = linePrefix.filter(el => el.length === 5);

  const [nine] = sixLen.filter(el => four.split('').every(pip => el.includes(pip)));
  const [three] = fiveLen.filter(el => oneSplit.every(pip => el.includes(pip)));
  
  const [e] = eight.split('').filter(el => !nine.includes(el));
  const [two] = fiveLen.filter(el => el !== three).filter(el => el.includes(e));
  const [five] = fiveLen.filter(el => ![two, three].includes(el));

  const [c] = oneSplit.filter(el => two.includes(el));
  const [zero] = sixLen.filter(el => el !== nine).filter(el => el.includes(c));
  const [six] = sixLen.filter(el => ![nine, zero].includes(el));

  return [zero, one, two, three, four, five, six, seven, eight, nine]
    .reduce((agg, curr, idx) => ({ ...agg, [curr]: idx }), {});
};

const getLineOutput = (line) => {
  const dict = getNumberDict(line.prefix);

  return Number(line.output.map(code => dict[code]).join(''));
};

const getOutputSum = (input) => (
  input.map(getLineOutput).reduce((sum, x) => sum + x, 0)
);

console.log({
   test: {
     a: countOneFourSevenEight(parseInput(test).map(el => el.output)),
     b: getOutputSum(parseInput(test)),
  },
   data: {
     a: countOneFourSevenEight(parseInput(data).map(el => el.output)),
     b: getOutputSum(parseInput(data)),
  },
});
