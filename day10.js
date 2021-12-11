const { data, test } = require('./data/day10');

const OPEN = {
  ANGLE: '<',
  BRACKET: '[',
  PAREN: '(',
  CURLY: '{',
};
const OPEN_CHARS = Object.values(OPEN);

const CLOSE = {
  ANGLE: '>',
  BRACKET: ']',
  PAREN: ')',
  CURLY: '}',
};
const CLOSE_CHARS = Object.values(CLOSE);

const OPEN_TO_CLOSE = {
  [OPEN.ANGLE]: CLOSE.ANGLE,
  [OPEN.BRACKET]: CLOSE.BRACKET,
  [OPEN.PAREN]: CLOSE.PAREN,
  [OPEN.CURLY]: CLOSE.CURLY,
};

const CORRUPT_COST = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};
const INCOMPLETE_COST = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const determineFirstCorruptCharacter = (line) => {
  const charArray = line.split('');
  const openStack = [];
  let nextChar = charArray.shift()
  while (nextChar) {
    if (OPEN_CHARS.includes(nextChar)) {
      openStack.push(nextChar);
    }
    if (CLOSE_CHARS.includes(nextChar)) {
      const matchingOpen = openStack.pop();
      if (OPEN_TO_CLOSE[matchingOpen] !== nextChar) {
        return nextChar;
      }
    }

    nextChar = charArray.shift();
  }
  return false;
};

const determineIncompleteLine = (line) => {
  const charArray = line.split('');
  const openStack = [];
  let nextChar = charArray.shift()
  while (nextChar) {
    if (OPEN_CHARS.includes(nextChar)) {
      openStack.push(nextChar);
    }
    if (CLOSE_CHARS.includes(nextChar)) {
      const matchingOpen = openStack.pop();
      if (OPEN_TO_CLOSE[matchingOpen] !== nextChar) {
        return false;
      }
    }

    nextChar = charArray.shift();
  }
  return line;
};

const computeClosingSequence = (line) => {
  const charArray = line.split('');
  const openStack = [];
  let nextChar = charArray.shift()
  while (nextChar) {
    if (OPEN_CHARS.includes(nextChar)) {
      openStack.push(nextChar);
    }
    if (CLOSE_CHARS.includes(nextChar)) {
      const matchingOpen = openStack.pop();
    }

    nextChar = charArray.shift();
  }

  return openStack.reverse().map(open => OPEN_TO_CLOSE[open]).join('');
}

const mapErrorCharToCost = (closeChar) => CORRUPT_COST[closeChar];

const getCorruptCost = (input) => input
  .map(determineFirstCorruptCharacter)
  .filter(el => el)
  .map(mapErrorCharToCost)
  .reduce((sum, x) => sum + x, 0);


const getMiddleIncompleteAggregation = (input) => input
  .map(determineIncompleteLine)
  .filter(el => el)
  .map(computeClosingSequence)
  .map(str => str.split(''))
  .map(arr => arr.reduce((agg, x) => agg * 5 + INCOMPLETE_COST[x], 0))
  .sort((a,b) => a - b)
  .filter((el, idx, arr) => idx === Math.floor(arr.length / 2));

console.log({ 
  test: {
    corruptCost: getCorruptCost(test),
    incompleteChars: getMiddleIncompleteAggregation(test),
  },
  data: {
    corruptCost: getCorruptCost(data),
    incompleteChars: getMiddleIncompleteAggregation(data)
  },
});
