const { directions } = require('./data/day2');

const HORIZONTAL = /forward\s/;
const MINUS = /up\s/;
const PLUS = /down\s/;

const { x, y, aim } = directions.reduce(({x, y, aim}, direction) => {
  if (direction.match(HORIZONTAL)) {
    const inc = Number(direction.replace(HORIZONTAL, ''));
    return {x: x + inc, y: y + aim * inc, aim};
  }

  if (direction.match(PLUS)) {
    const inc = Number(direction.replace(PLUS, ''));
    return {x, y, aim: aim + inc};
  }

  if (direction.match(MINUS)) {
    const inc = Number(direction.replace(MINUS, ''));
    return {x, y, aim: aim - inc};
  }
}, { x: 0, y: 0, aim: 0 });

console.log({ x, y, 'x*y': x * y, aim });
