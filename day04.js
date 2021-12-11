const { data, test } = require('./data/day04');

const parseInput = (input) => {
  const [numberPulls, ...combinedBoards] = input;

  const boards = combinedBoards.reduce((agg, currentRow, i) => {
    let ret = [...agg];
    if (i % 5 === 0) {
      ret = [...ret, []];
    }

    const retLen = ret.length - 1;

    ret[retLen] = [...ret[retLen], currentRow.trim().split(/\s+/).map(Number)];
    return ret;
  }, []);

  return { numberPulls: numberPulls.split(',').map(Number), boards };
};

const checkBoardForWinner = (called, board) => {
  if (board.some((row) => row.every(cell => called.includes(cell)))) {
    return true;
  }
  
  if (board.some((_, idx) => board.map(row => row[idx]).every(cell => called.includes(cell)))) {
    return true;
  }

  return false;
};

const findWinningBoard = (callOrder, candidateBoards, lookForLastWinner) => {
  let arrayMethod = 'some';
  if (lookForLastWinner) {
    arrayMethod = 'every';
  }

  return callOrder.reduce(({ called, didWin, winningBoard }, next, idx) => {
    if (didWin) {
      return { called, didWin, winningBoard };
    }

    const nextCalled = [...called, next];
    const nextDidWin = candidateBoards[arrayMethod](board => checkBoardForWinner(nextCalled, board));
    let nextWinningBoard = winningBoard;

    if (nextDidWin) {
      nextWinningBoard = candidateBoards.find(board => (
        lookForLastWinner
          ? !checkBoardForWinner(called, board)
          : checkBoardForWinner(nextCalled, board)
      ));
    }

    return { called: nextCalled, didWin: nextDidWin, winningBoard: nextWinningBoard };
  }, { called: [], didWin: false, winningBoard: null });
};

const computeScore = (numberOrder, boards, byLast) => {
  const { called, winningBoard } = findWinningBoard(numberOrder, boards, byLast);
  const uncalledSum = winningBoard
    .reduce((agg, row) => [...agg, ...row], [])
    .filter((cell) => !called.includes(cell))
    .reduce((sum, curr) => sum + curr, 0);
  const lastCalled = called[called.length - 1];
  
  return { called, winningBoard, uncalledSum, lastCalled, score: uncalledSum * lastCalled };
}

const { numberPulls: testPulls, boards: testBoards } = parseInput(test);
const { numberPulls, boards } = parseInput(data);

console.log(computeScore(testPulls, testBoards));
console.log(computeScore(testPulls, testBoards, true));

console.log(computeScore(numberPulls, boards));
console.log(computeScore(numberPulls, boards, true));
