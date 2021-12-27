const _fetch = require('isomorphic-fetch');
const { test, data } = require('./data/day25');

const checkEastwardMovement = (input) => {
  const canMove = input.some(string => (
    string.indexOf('>.') !== -1 || (string[0] === '.' && string.slice(-1) === '>')
  ));

  if (canMove) {
    const nextStep = input.map((row) => {
      const moveEndToFront = (row[0] === '.' && row.slice(-1) === '>');
      let nextRow = row.replaceAll('>.', '.>');
      if (moveEndToFront) {
        const temp = nextRow.split('');
        temp.splice(row.length - 1, 1, '.');
        temp.splice(0, 1, '>');
        nextRow = temp.join('');
      }

      return nextRow;
    });
    return {
      nextStep,
      moved: true,
    };
  }

  return {
    nextStep: input,
    moved: false,
  };
};

const transpose = (input) => (
  Array.from({ length: input[0].length }, (_, x) => (
    Array.from({ length: input.length }, (_, y) => (
      input[y][x]
    )).join('')
  ))
);

const checkSouthwardMovement = (input) => {
  const transposedInput = transpose(input);
  const canMove = transposedInput.some(string => (
    string.indexOf('v.') !== -1 || (string[0] === '.' && string.slice(-1) === 'v')
  ));

  if (canMove) {
    let nextStep = transposedInput.map((col) => {
      const moveEndToFront = (col[0] === '.' && col.slice(-1) === 'v');
      let nextCol = col.replaceAll('v.', '.v');
      if (moveEndToFront) {
        const temp = nextCol.split('');
        temp.splice(col.length - 1, 1, '.');
        temp.splice(0, 1, 'v');
        nextCol = temp.join('');
      }

      return nextCol;
    });
    nextStep = transpose(nextStep);

    return {
      nextStep,
      moved: true,
    };
  }

  return {
    nextStep: input,
    moved: false,
  };
};

const findFirstMoveWithNoMovement = (input) => {
  let moved = true;
  let count = 0;
  let current = input;
  while (moved) {
    moved = false;
    const { moved: movedEast, nextStep } = checkEastwardMovement(current);
    const { moved: movedSouth, nextStep: finalStep } = checkSouthwardMovement(nextStep);
    
    current = finalStep;
    moved = movedEast || movedSouth;
    count += 1;
  }

  return count;
};

console.log(findFirstMoveWithNoMovement(data));

