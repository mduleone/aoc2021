const { data: directions } = require('./data/day02');

const FORWARD = /forward\s(\d+)/;
const MINUS = /up\s(\d+)/;
const PLUS = /down\s(\d+)/;

const matchDirection = (direction, regex) => {
  const matches = direction.match(regex);
  if (!matches) {
    return null;
  }

  const [, number] = matches;

  return Number(number);
} 

const { x, y, aim } = directions.reduce(({ x, y, aim }, direction) => {
  const forward = matchDirection(direction, FORWARD);
  if (typeof forward === 'number') {
    return { x: x + forward, y: y + aim * forward, aim };
  }
  
  const plus = matchDirection(direction, PLUS);
  if (typeof plus === 'number') {
    return { x, y, aim: aim + plus };
  }
  
  const minus = matchDirection(direction, MINUS);
  if (typeof minus === 'number') {
    return { x, y, aim: aim - minus };
  }

  return { x, y, aim };
}, { x: 0, y: 0, aim: 0 });

console.log({ x, y, 'x*y': x * y, aim });
