const { test, data } = require('./data/day14');

const parseInput = (input) => {
  const [startRaw, ...rulesRaw] = input;

  const start = startRaw.split('')
    .reduce((agg, el, idx, arr) => {
      if (idx === arr.length - 1) {
        return agg;
      }

      const key = `${el}${arr[idx + 1]}`;
      if (!agg[key]) {
        agg[key] = 0;
      }
      agg[key] += 1;

      return agg;
    }, {});

  const rules = rulesRaw.reduce((agg, ruleRaw) => {
    const [, pair, insert] = ruleRaw.match(/([A-Z]{2}) -> ([A-Z])/);
    const [first, second] = pair.split('');

    return {
      ...agg,
      [pair]: [`${first}${insert}`, `${insert}${second}`],
    };
  }, {});

  return { startRaw, start, rules };
};

const advanceStep = (start, rules) => {
  return Object.entries(start).reduce((agg, [key, count], idx, arr) => {
    const [first, second] = rules[key];
    if (!agg[first]) {
      agg[first] = 0;
    }
    if (!agg[second]) {
      agg[second] = 0;
    }
    
    agg[first] += count;
    agg[second] += count;

    return agg;
  }, {});
};

const applyNSteps = (start, rules, steps) => (
  Array.from({ length: steps }).reduce((agg, _, idx) => advanceStep(agg, rules), start)
);

const computeCharCounts = (pairCounts, rawStart) => {
  const counts = Object.entries(pairCounts).reduce((agg, [el, count]) => {
    const [first, second] = el.split('');
    if (!agg[first]) {
      agg[first] = 0;
    }
    if (!agg[second]) {
      agg[second] = 0;
    }

    agg[first] += count;
    agg[second] += count;

    return agg;
  }, {});

  counts[rawStart[0]] += 1;
  counts[rawStart[rawStart.length - 1]] += 1;

  return Object.fromEntries(Object.entries(counts).map(([k,v]) => ([k, v/2])));
};

const getMostMinusLeastFromCounts = (countsObj) => {
  const counts = Object.values(countsObj)
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  
  return max - min;
};

const getDiff = (input, iterations) => {
  const parsedInput = parseInput(input);
  return getMostMinusLeastFromCounts(
    computeCharCounts(
      applyNSteps(parsedInput.start, parsedInput.rules, iterations), parsedInput.startRaw
    )
  );
};

console.log({
  test: {
    a: getDiff(test, 10),
    b: getDiff(test, 40),
  },
  data: {
    a: getDiff(data, 10),
    b: getDiff(data, 40),
  },
});
