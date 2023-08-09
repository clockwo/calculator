calculatorButtonsElement = document.querySelector(
  `[data-js-calculator-buttons]`
);
screenOutputElement = document.querySelector(`[data-js-screen-output]`);

let calculationSequence = [];

const operationSymbols = {
  multiply: '*',
  divide: '÷',
  plus: '+',
  minus: '-',
  equal: '=',
};

const conditionChecks = {
  isMathSequenceNotEmpty: () => calculationSequence.length > 0,
  isLastElementNotSpecialSymbol: (lastElement) =>
    !Object.values(operationSymbols).includes(lastElement),
  isLastSpecialSymbolNotEqual: (lastSpecialSymbol) => lastSpecialSymbol !== '=',
};

const operators = {
  plus: (x, y) => x + y,
  minus: (x, y) => x - y,
  multiply: (x, y) => x * y,
  divide: (x, y) => x / y,
};

const createOperationFunction =
  (operation) =>
  (x = calculationSequence.join('')) => {
    const specialSymbolKey = findSpecialSymbolInMathSequence();
    if (specialSymbolKey) {
      const operator = operationSymbols[specialSymbolKey];
      let [left, right] = x.split(operator);
      calculationSequence = `${left}${operator}${operation(right)}`.split('');
      return;
    }
    calculationSequence = `${operation(x)}`.split('');
  };

const actions = {
  clear: () => {
    calculationSequence = [];
  },
  deleteLastIndex: () => {
    calculationSequence.pop();
  },
  powerTwo: createOperationFunction((x) => x ** 2),
  percent: createOperationFunction((x) => x / 100),
};

const splitCalculationAtSymbol = (specialSymbol) => {
  if (calculationSequence[0] === '-') {
    const joinedSequence = calculationSequence.join('');
    let splitSequence = joinedSequence.slice(1).split(specialSymbol);
    splitSequence[0] = `-${splitSequence[0]}`;
    return splitSequence;
  }
  return calculationSequence.join('').split(specialSymbol);
};

const appendToCalculationSequence = (input) => calculationSequence.push(input);

const displayCalculationSequence = () => {
  if (calculationSequence.length >= 0) {
    screenOutputElement.innerHTML = calculationSequence.join('');
  }
};

const findSpecialSymbolInMathSequence = () => {
  return Object.keys(operationSymbols).find((key) =>
    calculationSequence.includes(operationSymbols[key])
  );
};

const isSequenceNotEmptyAndLastElementNotSpecial = (lastElement) => {
  return (
    conditionChecks.isMathSequenceNotEmpty() &&
    conditionChecks.isLastElementNotSpecialSymbol(lastElement)
  );
};

const shouldAddSpecialSymbolToSequence = (lastElement, lastSpecialSymbol) => {
  return (
    conditionChecks.isLastSpecialSymbolNotEqual(lastSpecialSymbol) &&
    conditionChecks.isLastElementNotSpecialSymbol(lastElement) &&
    conditionChecks.isMathSequenceNotEmpty()
  );
};

const processExistingSpecialSymbolInSequence = (lastSpecialSymbol) => {
  const specialSymbolKey = findSpecialSymbolInMathSequence();
  if (specialSymbolKey) {
    const [leftSide, rightSide] = splitCalculationAtSymbol(
      operationSymbols[specialSymbolKey]
    );

    //I don't know how to fix that in proper way, so be it
    //Bug is show then we have for example -4 and press equal lead to NaN
    //This small condition handle that
    if (!rightSide) {
      return;
    }

    const tempResult = operators[specialSymbolKey](+leftSide, +rightSide);

    calculationSequence = conditionChecks.isLastSpecialSymbolNotEqual(
      lastSpecialSymbol
    )
      ? `${tempResult}${lastSpecialSymbol}`.split('')
      : `${tempResult}`.split('');
  }
};

const processOperationSymbol = (input, lastElement) => {
  const lastSpecialSymbol = operationSymbols[input];

  if (isSequenceNotEmptyAndLastElementNotSpecial(lastElement)) {
    processExistingSpecialSymbolInSequence(lastSpecialSymbol);
    lastElement = calculationSequence[calculationSequence.length - 1];
  }

  if (shouldAddSpecialSymbolToSequence(lastElement, lastSpecialSymbol)) {
    calculationSequence.push(lastSpecialSymbol);
  }
};

const processUserInput = (target) => {
  const userInput = target.dataset.calc;
  const userAction = target.dataset.action;
  const lastElement = calculationSequence[calculationSequence.length - 1];

  if (userInput in operationSymbols) {
    processOperationSymbol(userInput, lastElement);
  } else if (userAction) {
    actions[userAction]();
  } else {
    appendToCalculationSequence(userInput);
  }

  displayCalculationSequence();
};

calculatorButtonsElement.addEventListener('click', ({ target }) => {
  let button = target.closest('button');
  if (!button) return;
  if (!calculatorButtonsElement.contains(button)) return;

  processUserInput(button);
});
