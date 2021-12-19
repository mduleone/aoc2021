const { test, data } = require('./data/day18');

const maybeExplode = (str) => {
  let idx = 0;
  let preNumberToLeft = '';
  let postNumberToLeft = '';
  let numberToLeft = null;
  let numberToAddToRight = null;
  let nextStr = '';
  let exploded = false;
  const trackedOpens = [];

  while (idx < str.length) {
    if (exploded) {
      const matchesNumber = str.slice(idx).match(/^(\d+)/);
      if (!numberToAddToRight || !matchesNumber) {
        nextStr += str[idx];
        idx += 1;
      } else if (matchesNumber) {
        const [, num] = matchesNumber;
        nextStr += `${Number(num) + numberToAddToRight}`;
        numberToAddToRight = null;
        idx += num.length;
      }
      continue;
    }

    if (str[idx] === '[') {
      trackedOpens.push(idx);
      if (trackedOpens.length === 5) {
        const matches = str.slice(idx).match(/^\[(\d+),(\d+)\]/);
        const [matchedString, explodeLeft, explodeRight] = matches;
        nextStr = preNumberToLeft + (
          typeof numberToLeft === 'number'
            ? `${numberToLeft + Number(explodeLeft)}${postNumberToLeft}`
            : ''
        ) + '0';
        numberToAddToRight = Number(explodeRight);
        exploded = true;
        idx += matchedString.length;
        continue;
      }

      if (typeof numberToLeft === 'number') {
        postNumberToLeft += str[idx];
      } else {
        preNumberToLeft += str[idx];
      }
      idx += 1;
      continue;
    }

    if (str[idx] === ']') {
      trackedOpens.pop();

      if (typeof numberToLeft === 'number') {
        postNumberToLeft += str[idx];
      } else {
        preNumberToLeft += str[idx];
      }
      idx += 1;
      continue;
    }

    if (str[idx] === ',') {
      if (typeof numberToLeft === 'number') {
        postNumberToLeft += str[idx];
      } else {
        preNumberToLeft += str[idx];
      }
      idx += 1;
      continue;
    }
    
    const matchesNumber = str.slice(idx).match(/^(\d+)/);
    if (matchesNumber) {
      const [, num] = matchesNumber;
      if (exploded && typeof numberToAddToRight === 'number') {
        const nextNumber = numberToAddToRight + Number(num);

        nextStr += `${nextNumber}`;
        idx += num.length;
        continue;
      }

      const origNumberToLeft = numberToLeft;
      numberToLeft = Number(num);

      if (typeof origNumberToLeft === 'number') {
        preNumberToLeft += `${origNumberToLeft}` + postNumberToLeft;
        postNumberToLeft = '';
      }

      idx += num.length;
      continue;
    }
    
    if (typeof numberToLeft === 'number') {
      postNumberToLeft += str[idx];
    } else {
      preNumberToLeft += str[idx];
    }

    idx += 1;
  }

  if (!exploded) {
    nextStr = preNumberToLeft + numberToLeft + postNumberToLeft;
  }
  return { exploded, nextStr }
};

const maybeSplit = (str) => {
  let idx = 0;
  let nextStr = '';
  let split = false;
  while (idx < str.length) {
    let nextChar = str[idx];
    let addToIdx = 1;
    if (split) {
      nextStr += nextChar;
      idx += addToIdx;
      continue;
    }
    const matchesNumber = str.slice(idx).match(/^(\d+)/);
    if (matchesNumber) {
      const [, num] = matchesNumber;

      if (num >= 10) {
        const left = Math.floor(num / 2);
        const right = Math.ceil(num / 2);

        nextChar = `[${left},${right}]`;
        split = true;
      }
      addToIdx = num.length;
    }

    nextStr += nextChar;
    idx += addToIdx;
  }

  return { split, nextStr };
};

const reduceSnailfishNumber = (str) => {
  let split = false;
  let exploded = false;
  let nextStr = str;
  do {
    ({ exploded, nextStr } = maybeExplode(nextStr));
    if (exploded) {
      continue;
    }
    ({ split, nextStr } = maybeSplit(nextStr));

  } while (split || exploded);

  return nextStr;
};

const add = (a, b) => reduceSnailfishNumber(`[${a},${b}]`);
const sumListOfNumbers = ([first, ...rest]) => rest.reduce((agg, curr) => add(agg, curr), first);

const computeMagnitude = (sfNumber) => {
  if (typeof sfNumber === 'string') {
    sfNumber = JSON.parse(sfNumber);
  }

  let [left, right] = sfNumber;

  if (Array.isArray(left)) {
    left = computeMagnitude(left);
  }

  if (Array.isArray(right)) {
    right = computeMagnitude(right);
  }

  return 3 * left + 2 * right;
};

const getLargestMagnitude = (list) => {
  let largestMagnitude = -Infinity;
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (i === j) {
        continue;
      }

      const currMag = computeMagnitude(add(list[i], list[j]));
      if (currMag > largestMagnitude) {
        largestMagnitude = currMag;
      }
    }
  }

  return largestMagnitude;
};

console.log({
  test: {
    a: computeMagnitude(sumListOfNumbers(test)),
    b: getLargestMagnitude(test),
  },
  data: {
    a: computeMagnitude(sumListOfNumbers(data)),
    b: getLargestMagnitude(data),
  },
})
