//TODO
// ! Change querySelector to take data from data-*
// ! Function to arrow functions
// ! deconstruct event

calculatorButtonsElement = document.querySelector(
  `[data-js-calculator-buttons]`
);
screenOutputElement = document.querySelector(`[data-js-screen-output]`);

let calculationSequence = [];

const operationSymbols = {
  plus: '+',
  minus: '-',
  equal: '=',
  multiply: '*',
  divide: '÷',
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

const splitCalculationAtSymbol = (specialSymbol) =>
  calculationSequence.join('').split(specialSymbol);

const appendToCalculationSequence = (input) => calculationSequence.push(input);

const displayCalculationSequence = () => {
  if (calculationSequence.length > 0) {
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
    conditionChecks.isLastElementNotSpecialSymbol(lastElement)
  );
};

const processExistingSpecialSymbolInSequence = (lastSpecialSymbol) => {
  const specialSymbolKey = findSpecialSymbolInMathSequence();
  if (specialSymbolKey) {
    const [leftSide, rightSide] = splitCalculationAtSymbol(
      operationSymbols[specialSymbolKey]
    );
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
// function processOperationSymbol(input, lastElement) {
//   const lastSpecialSymbol = operationSymbols[input];

//   if (isSequenceNotEmptyAndLastElementNotSpecial(lastElement)) {
//     processExistingSpecialSymbolInSequence(lastSpecialSymbol);
//     lastElement = calculationSequence[calculationSequence.length - 1];
//   }

//   if (shouldAddSpecialSymbolToSequence(lastElement, lastSpecialSymbol)) {
//     calculationSequence.push(lastSpecialSymbol);
//   }
// }

function processUserInput(target) {
  const userInput = target.dataset.calc;
  const lastElement = calculationSequence[calculationSequence.length - 1];

  if (userInput in operationSymbols) {
    processOperationSymbol(userInput, lastElement);
  } else {
    appendToCalculationSequence(userInput);
  }
  displayCalculationSequence();
}

calculatorButtonsElement.addEventListener('click', ({ target }) => {
  let button = target.closest('button');
  if (!button) return;
  if (!calculatorButtonsElement.contains(button)) return;

  processUserInput(button);
});

// 15 + 20 + 30 + 40 * 2 + 50 * 3 / 2 * 5 ->
// 15 + 20 + 30 + (40 * 2) + (((50 * 3) / 2) * 5)
//find first * or any high operator, and take left and right index

//del with special symbol
