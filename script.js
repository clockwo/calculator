calcArea = document.querySelector('.calculator__buttons');
screenOutput = document.querySelector('.screen-output');

let mathSequence = [];
let isOld = false;

const specialSymbols = {
  plus: '+',
  minus: '-',
  equal: '=',
};

function plus(x, y) {
  return x + y;
}

function minus(x, y) {
  return x - y;
}

const operators = {
  plus: plus,
  minus: minus,
};

function separate(specialSymbol) {
  return mathSequence.join('').split(specialSymbol);
}

function updateScreen() {
  if (mathSequence.length > 0) {
    screenOutput.innerHTML = mathSequence.join('');
  }
}

function addSpecialSymbol(input, lastElement) {
  for (const [key, item] of Object.entries(specialSymbols)) {
    if (mathSequence.indexOf(item) > 0) {
      let tempSpecial = item;
      let [leftSide, rightSide] = [...separate(tempSpecial)];
      let tempResult = operators[key](+leftSide, +rightSide);
      mathSequence = `${tempResult}${tempSpecial}`.split('');
      return;
    }
  }
  if (
    mathSequence.length > 0 &&
    !Object.values(specialSymbols).includes(lastElement)
  ) {
    mathSequence.push(specialSymbols[input]);
  }
}

function addDigit(input) {
  mathSequence.push(input);
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

calcArea.addEventListener('click', (event) => {
  let button = event.target.closest('button');
  if (!button) return;
  if (!calcArea.contains(button)) return;

  addToSequence(button);
});

// 15 + 20 + 30 + 40 * 2 + 50 * 3 / 2 * 5 ->
// 15 + 20 + 30 + (40 * 2) + (((50 * 3) / 2) * 5)
//find first * or any high operator, and take left and right index

//del with special symbol
