//TODO
// ! Change querySelector to take data from data-*
// ! Function to arrow functions
// ! deconstruct event

calculatorButtonsElement = document.querySelector(
  `[data-js-calculator-buttons]`
);
screenOutputElement = document.querySelector(`[data-js-screen-output]`);

let mathSequence = [];
let isOld = false;

const specialSymbols = {
  plus: '+',
  minus: '-',
  equal: '=',
  multiply: '*',
  divide: '÷',
};

const operators = {
  plus: (x, y) => x + y,
  minus: (x, y) => x - y,
  multiply: (x, y) => x * y,
  divide: (x, y) => x / y,
  powerTwo: (x, y) => x,
};

const separateString = (specialSymbol) =>
  mathSequence.join('').split(specialSymbol);

const addDigit = (input) => mathSequence.push(input);

const updateScreen = () => {
  if (mathSequence.length > 0) {
    screenOutputElement.innerHTML = mathSequence.join('');
  }
};

function addSpecialSymbol(input, lastElement) {
  const lastSpecialSymbol = specialSymbols[input];
  if (
    mathSequence.length > 0 &&
    !Object.values(specialSymbols).includes(lastElement)
  ) {
    for (const [key, item] of Object.entries(specialSymbols)) {
      if (mathSequence.indexOf(item) > 0) {
        const tempSpecial = item;
        const [leftSide, rightSide] = [...separateString(tempSpecial)];
        const tempResult = operators[key](+leftSide, +rightSide);
        mathSequence = `${tempResult}${lastSpecialSymbol}`.split('');
        return;
      }
    }
    mathSequence.push(specialSymbols[input]);
  }
}

function addToSequence(target) {
  const userInput = target.dataset.calc;
  const lastElement = mathSequence[mathSequence.length - 1];

  if (userInput in specialSymbols) {
    addSpecialSymbol(userInput, lastElement);
  } else {
    addDigit(userInput);
  }
  updateScreen();
}

calculatorButtonsElement.addEventListener('click', ({ target }) => {
  let button = target.closest('button');
  if (!button) return;
  if (!calculatorButtonsElement.contains(button)) return;

  addToSequence(button);
});

// 15 + 20 + 30 + 40 * 2 + 50 * 3 / 2 * 5 ->
// 15 + 20 + 30 + (40 * 2) + (((50 * 3) / 2) * 5)
//find first * or any high operator, and take left and right index

//del with special symbol
