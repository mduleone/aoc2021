const { test, data } = require('./data/day20');

const parseInput = (input) => {
  const [outputKey, ...image] = input;

  return {
    outputKey,
    image,
  };
};

const convertBit = (bit) => bit === '#' ? '1' : '0';

const getDecimalNumberFromCoordinate = (image, [x, y], idx, shouldInvert) => {
  const width = image[0].length;
  const height = image.length;
  let enhancementDefault = '0';
  if (shouldInvert) {
    enhancementDefault = idx % 2 === 1 ? '1' : '0';
  }

  const enhancement = [
    [enhancementDefault, enhancementDefault, enhancementDefault],
    [enhancementDefault, enhancementDefault, enhancementDefault],
    [enhancementDefault, enhancementDefault, enhancementDefault],
  ];

  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i < 0 || i > width - 1 || j < 0 || j > height - 1) {
        continue;
      }
      enhancement[j - (y - 1)][i - (x - 1)] = convertBit(image[j][i]);
    }
  }
  const binStr = enhancement.map(row => row.join('')).join('');
  const decimal = parseInt(binStr, 2);

  return decimal;
};

const processImage = (image, transformKey, idx) => {
  const outputWidth = image[0].length + 2;
  const outputHeight = image.length + 2;

  const outputImage = Array.from({ length: outputHeight }, () => Array.from({ length: outputWidth }, () => 'X'));;

  const coordinatesToCompute = [];

  for (x = -1; x < outputWidth - 1; x++) {
    for (y = -1; y < outputHeight - 1; y++) {
      coordinatesToCompute.push([x, y]);
    }
  }

  const processedImage = coordinatesToCompute.reduce((agg, coord) => (
    agg.set(
      coord.map((t) => t + 1).join(','),
      transformKey[getDecimalNumberFromCoordinate(image, coord, idx, transformKey[0] !== '.')],
    )
  ), new Map());

  processedImage.forEach((value, coords) => {
    const [x, y] = coords.split(',');
    outputImage[y][x] = value;
  });

  return outputImage.map(row => row.join(''));
};

const solve = (input, length) => {
  const { image, outputKey } = parseInput(input);
  const processedImage = Array.from({ length })
    .reduce((agg, _, idx) => processImage(agg, outputKey, idx), image);

  const litUp = processedImage
    .map(row => row.split('').filter(x => x === '#').length)
    .reduce((sum, x) => sum + x, 0);

  return litUp;
};

console.log({
  test: {
    a: solve(test, 2),
    b: solve(test, 50),
  },
  data: {
    a: solve(data, 2),
    b: solve(data, 50),
  }
});
