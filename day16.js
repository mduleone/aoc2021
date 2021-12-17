const { data, test } = require('./data/day16');

const hexToBin = (hex) => (parseInt(hex, 16).toString(2)).padStart(4, '0');

const parseInput = ([input]) => (
  input.split('').reduce((agg, curr) => [...agg, ...hexToBin(curr).split('')], [])
);

const HEADER_BITS = 6;

const processLiteralRest = (rest, processExtraBits = true) => {
  let next = [...rest];
  let value = [];
  let readNext, c1, c2, c3, c4;
  do {
    ([readNext, c1, c2, c3, c4, ...next] = next);
    
    value = [...value, c1, c2, c3, c4];
  } while(readNext !== '0');

  const valueLen = value.length;
  const currentTotalLength = valueLen + (valueLen / 4);
  let skip = [];
  if (processExtraBits) {
    const skipBits = 8 - ((currentTotalLength + HEADER_BITS) % 8);
  
    skip = next.slice(0, skipBits);
    next = next.slice(skipBits);
  }

  const processedLength = currentTotalLength + skip.length;

  return { value: parseInt(value.join(''), 2), skip, processedLength, remaining: next };
};

const processOperator = (rest) => {
  let [lengthType, ...next] = [...rest];

  let lengthSubPackets;
  let numSubPackets;
  if (lengthType === '0') {
    // next 15 = total length of subpackets of this operator
    lengthSubPackets = parseInt(next.slice(0, 15).join(''), 2);
    next = next.slice(15);
  } else {
    // next 11 = total number of subpackets of this operator
    numSubPackets = parseInt(next.slice(0, 11).join(''), 2);
    next = next.slice(11);
  }

  const value = [];
  let childProcessedLength = 0;
  let version, type, elValue, processedLength, skip, remaining;
  if (lengthType === '0') {
    while (childProcessedLength < lengthSubPackets) {
      ({
        version,
        type,
        value: elValue,
        processedLength,
        skip,
        remaining,
      } = processNextPacket(next));
      value.push({
        version,
        type,
        value: elValue,
        processedLength,
      });
      next = remaining;
      childProcessedLength += processedLength;
    }
    const totalProcessedLength = value.reduce((len, curr) => len + curr.processedLength, 0) + 1 + 15;
    return { value, skip, processedLength: totalProcessedLength, remaining };
  }

  for (let i = 0; i < numSubPackets; i++) {
    ({
      version,
      type,
      value: elValue,
      processedLength,
      skip,
      remaining,
    } = processNextPacket(next));
    value.push({
      version,
      type,
      value: elValue,
      processedLength,
    });
    next = remaining;
    childProcessedLength += processedLength;
  }
  const totalProcessedLength = value.reduce((len, curr) => len + curr.processedLength, 0) + 1 + 11;
  return { value, skip, processedLength: totalProcessedLength, remaining };
};

const processNextPacket = (input, shouldSkipToEnd = false) => {
  const [v1, v2, v3, t1, t2, t3, ...rest] = input;
  const vBin = [v1, v2, v3].join('');
  const tBin = [t1, t2, t3].join('');

  const version = parseInt(vBin, 2);
  const type = parseInt(tBin, 2);

  let value;
  let remaining;
  let skip;
  let processedLength;
  if (type === 4) {
    ({ value, skip, processedLength, remaining } = processLiteralRest(rest, shouldSkipToEnd));
  } else {
    ({ value, skip, processedLength, remaining } = processOperator(rest));
  }

  const packetProcessedLength = HEADER_BITS + processedLength;

  return {
    version,
    type,
    value,
    processedLength: packetProcessedLength,
    skip,
    remaining,
  };
};

const sumVersions = (processedPackets) => {
  const sum = JSON.stringify(processedPackets, null, 2)
    .split('\n')
    .filter(str => str.includes('version'))
    .map(str => str.replace(/\s+"version":\s/, ''))
    .map(str => str.replace(',', ''))
    .map(Number)
    .reduce((sum, x) => sum + x, 0);

  return sum;
};

const processParsedPacket = ({ version, value, type }) => {
  if (type === 0) {
    return value.reduce((sum, val) => sum + processParsedPacket(val), 0);
  }

  if (type === 1) {
    return value.reduce((prod, val) => prod * processParsedPacket(val), 1);
  }

  if (type === 2) {
    return Math.min(...value.map(processParsedPacket));
  }

  if (type === 3) {
    return Math.max(...value.map(processParsedPacket));
  }

  if (type === 4) {
    return value;
  }

  if (type === 5) {
    const [first, second] = value;
    return processParsedPacket(first) > processParsedPacket(second) ? 1 : 0;
  }

  if (type === 6) {
    const [first, second] = value;
    return processParsedPacket(first) < processParsedPacket(second) ? 1 : 0;
  }

  if (type === 7) {
    const [first, second] = value;
    return processParsedPacket(first) === processParsedPacket(second) ? 1 : 0;
  }
};

console.log(sumVersions(processNextPacket(parseInput(data))));
console.log(processParsedPacket(processNextPacket(parseInput(data))));
