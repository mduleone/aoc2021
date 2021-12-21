const { test, data } = require('./data/day21');

const advanceToken = (starting, count) => {
  const advanceTo = (starting + count) % 10;
  if (advanceTo === 0) {
    return 10;
  }

  return advanceTo;
};

const generateDeterministicDieRoll = () => {
  let current = 0;
  
  return () => {
    if (current === 100) {
      current = 1;

      return current;
    }
    current++;

    return current;
  };
};

const playGame = (playerOneStarting, playerTwoStarting) => {
  const rollDie = generateDeterministicDieRoll();
  const scores = {
    '1': 0,
    '2': 0,
  };
  const positions = {
    '1': playerOneStarting,
    '2': playerTwoStarting,
  };
  let playerOneTurn = true;
  let turns = 0;

  while (scores[1] < 1000 && scores[2] < 1000) {
    const activePlayer = playerOneTurn ? '1' : '2';
    const roll = Array.from({ length: 3 }).reduce((sum) => {
      const nextDie = rollDie();
      return sum + nextDie;
    }, 0);
    const nextPosition = advanceToken(positions[activePlayer], roll);
    scores[activePlayer] += nextPosition;
    positions[activePlayer] = nextPosition;

    turns++;
    playerOneTurn = !playerOneTurn;
  }

  const diceRolls = turns * 3;

  return Math.min(...Object.values(scores)) * diceRolls;
};

/**
 * Each step
 * 1 -> 1 -> 1, 3
 * 1 -> 1 -> 2, 4
 * 1 -> 1 -> 3, 5
 * 1 -> 2 -> 1, 4
 * 1 -> 2 -> 2, 5
 * 1 -> 2 -> 3, 6
 * 1 -> 3 -> 1, 5
 * 1 -> 3 -> 2, 6
 * 1 -> 3 -> 3, 7
 *
 * 2 -> 1 -> 1, 4
 * 2 -> 1 -> 2, 5
 * 2 -> 1 -> 3, 6
 * 2 -> 2 -> 1, 5
 * 2 -> 2 -> 2, 6
 * 2 -> 2 -> 3, 7
 * 2 -> 3 -> 1, 6
 * 2 -> 3 -> 2, 7
 * 2 -> 3 -> 3, 8
 *
 * 3 -> 1 -> 1, 5
 * 3 -> 1 -> 2, 6
 * 3 -> 1 -> 3, 7
 * 3 -> 2 -> 1, 6
 * 3 -> 2 -> 2, 7
 * 3 -> 2 -> 3, 8
 * 3 -> 3 -> 1, 7
 * 3 -> 3 -> 2, 8
 * 3 -> 3 -> 3, 9
 *
 * Advance squares: Universe spawn count
 * 3: 1
 * 4: 3
 * 5: 6
 * 6: 7
 * 7: 6
 * 8: 3
 * 9: 1
 *
 */

const advanceObj = {
  3: 1,
  4: 3,
  5: 6,
  6: 7,
  7: 6,
  8: 3,
  9: 1,
};

const advanceDiracGame = (diracObject, isPlayerOneTurn) => (
  Object.entries(diracObject).reduce((agg, [key, count]) => {
    const [ p1Score, p1Pos, p2Score, p2Pos ] = key.split(',').map(Number);

    Object.entries(advanceObj).forEach(([advanceSteps, advanceCount]) => {
      if (isPlayerOneTurn) {
        const nextP1Pos = advanceToken(p1Pos, Number(advanceSteps));
        const nextP1Score = p1Score + nextP1Pos;
        const nextCount = count * advanceCount;
        const key = [nextP1Score, nextP1Pos, p2Score, p2Pos].join();

        agg[key] = (agg[key] ?? 0) + nextCount;
        return;
      }
      const nextP2Pos = advanceToken(p2Pos, Number(advanceSteps));
      const nextP2Score = p2Score + nextP2Pos;
      const nextCount = count * advanceCount;
      const key = [p1Score, p1Pos, nextP2Score, nextP2Pos].join();

      agg[key] = (agg[key] ?? 0) + nextCount;
    });

    return agg;
  }, {})
);

const playDiracGame = (playerOneStarting, playerTwoStarting) => {
  const startingKey = [0, playerOneStarting, 0, playerTwoStarting].join();
  const starting = {
    [startingKey]: 1,
  };

  let playerOneTurn = true;
  let next = starting;
  const wins = {
    p1: 0,
    p2: 0,
  };

  while (Object.keys(next).length > 0) {
    next = advanceDiracGame(next, playerOneTurn);

    Object.keys(next).forEach((key) => {
      const [ p1Score, p1Pos, p2Score, p2Pos ] = key.split(',').map(Number);
      if (p1Score >= 21) {
        wins.p1 += next[key];
        delete next[key];
        return;
      }
      if (p2Score >= 21) {
        wins.p2 += next[key];
        delete next[key];
        return;
      }
    });

    playerOneTurn = !playerOneTurn;
  }

  return wins;
};

console.log(playGame(4, 8));
console.log(playGame(7, 4));
console.log(playDiracGame(4, 8));
console.log(playDiracGame(7, 4));
