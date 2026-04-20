function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

function modulo(num1, num2) {
    return num1 % num2;
}

function operate(op, a, b) {
    switch (op) {
        case '+': return add(a, b);
        case '-': return subtract(a, b);
        case '*': return multiply(a, b);
        case '/': return divide(a, b);
        case '%': return modulo(a, b);
    }
}

// state
let num1 = '0';
let operator = null;
let num2 = null;
let isError = false;
let lastActionWasEquals = false;

const display = document.querySelector('#display');
const buttons = document.querySelector('.buttons');

// handlers
function handleDigit(value){
    if (lastActionWasEquals && operator === null) {
        num1 = value;
        isError = false;
        lastActionWasEquals = false;

        render();
        return;
    }
    if (operator === null) {
        num1 = (num1 === '0') ? value : num1 + value;
    } else {
        num2 = (num2 === null || num2 === '0') ? value : num2 + value;
    }
    isError = false;
    render();
}

function handleOperator(value) {
    if (isError) return;

    // if user wants to substitute operator; changed their mind.
    if (operator !== null && num2 === null) {
        operator = value;
        render();
        return;
    } 

    // If user already chose num1, operator, and num2. This computes the values and swaps num1 to result.
    if (operator !== null && num2 !== null) {
        handleEquals();
        if (isError) return;
        operator = value;
        render();
        return;
    }

    // Fresh operator
    operator = value;
    render();
}

function handleDecimal() {
    if (isError) return;

    if (lastActionWasEquals && operator === null) {
        num1 = '0.';
        lastActionWasEquals = false;
        render();
        return;
    }
    // Find out which operation we're on. If true, we're on number 1, if false, on number 2.
    if (operator === null) {
        if (!num1.includes('.')) num1 += '.';
    } else if (num2 === null) {
        return;
    } else {
        if (!num2.includes('.')) num2 += '.';
    }
    render();
}

function handleDelete() {
    if (isError) return;

    // Check which state we're on and update
    if (num2 !== null) {
        num2 = num2.length <= 1 ? null : num2.slice(0, -1);
    } else if (operator !== null) {
        operator = null;
    } else {
        num1 = num1.length <= 1 ? '0' : num1.slice(0, -1);
    }
    render();
}

function handleClear() {
    num1 = '0';
    operator = null;
    num2 = null;
    isError = false;
    lastActionWasEquals = false;
    render();
}

function handleEquals() {
    if (operator === null || num2 === null) return;

    const result = operate(operator, parseFloat(num1), parseFloat(num2));
    
    // If number was divided or modulo by 0 it equals +-Infinity
    if (!Number.isFinite(result)) {
        isError = true;
        display.value = 'Error';

        // reset
        num1 = '0';
        operator = null;
        num2 = null;

        render();
        return;
    }

    num1 = String(Number(result.toFixed(10)));
    operator = null;
    num2 = null;
    lastActionWasEquals = true;
    render();
}

buttons.addEventListener('click', (e) => {
    // Find target button
    const btn = e.target.closest('button');
    if (!btn) return;

    // Create action and value from data-action and data-value of button
    const {action, value} = btn.dataset;

    switch (action) {
        case 'digit':    handleDigit(value);    break;
        case 'operator': handleOperator(value); break;
        case 'equals':   handleEquals();        break;
        case 'decimal':  handleDecimal();       break;
        case 'delete':   handleDelete();        break;
        case 'clear':    handleClear();         break;
    }
})

/**
 * This function serves as an updater for the display value. As handlers cannot update display,
 * render should be called to read the current state and update display value.
 */
function render() {
    if (isError) return; // Error message stays until cleared

    // This makes sure that neither operator or num2 is null or undefined
    display.value = num1 + (operator ?? '') + (num2 ?? '');
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (/\d/.test(key)) {
        handleDigit(key);
        return;
    }

    switch (key) {
        case 'Backspace': e.preventDefault(); handleDelete(); break;
        case 'Enter':     handleEquals(); break;
        case 'Escape':    e.preventDefault(); handleClear(); break;
        case '.':         handleDecimal(); break;
        case '+':
        case '-':
        case '*':
        case '/':         e.preventDefault(); handleOperator(key); break;
        case '%':         handleOperator(key); break;
    }
});
