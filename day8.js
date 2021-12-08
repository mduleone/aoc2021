const { data, test } = require('./data/day8');

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

const getNumbers = (linePrefix) => {
  const [one] = linePrefix.filter(el => el.length === 2);
  const [four] = linePrefix.filter(el => el.length === 4);
  const [seven] = linePrefix.filter(el => el.length === 3);
  const [eight] = linePrefix.filter(el => el.length === 7);

  const oneSplit = one.split('');
  const sixLen = linePrefix.filter(el => el.length === 6);
  const fiveLen = linePrefix.filter(el => el.length === 5);

  const [nine] = sixLen.filter(el => four.split('').every(pip => el.split('').includes(pip)));
  const [three] = fiveLen.filter(el => oneSplit.every(pip => el.split('').includes(pip)));
  
  const [e] = eight.split('').filter(el => !nine.includes(el));
  const [two] = fiveLen.filter(el => el !== three).filter(el => el.includes(e));
  const [five] = fiveLen.filter(el => ![two, three].includes(el));

  const [c] = oneSplit.filter(el => two.includes(el));
  const [zero] = sixLen.filter(el => el !== nine).filter(el => el.includes(c));
  const [six] = sixLen.filter(el => ![nine, zero].includes(el));

  return [zero, one, two, three, four, five, six, seven, eight, nine];
};

const getLineOutput = (line) => {
  const numbers = getNumbers(line.prefix);

  const dict = numbers.reduce((agg, curr, idx) => ({ ...agg, [curr]: idx }), {});

  return Number(line.output.map(code => dict[code]).join(''));
};

const getOutputSum = (input) => {
  return input.map(getLineOutput).reduce((sum, x) => sum + x, 0);
};

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
