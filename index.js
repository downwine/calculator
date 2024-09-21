document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.button');
    let currentValue = '0';
    let previousValue = '';
    let operator = null;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            const value = button.dataset.value;
            
            if (value !== undefined) {
                handleNumber(value);
            } else if (action !== undefined) {
                handleAction(action);
            }

            updateDisplay();
        });
    });

    function handleNumber(number) {
        // console.log(previousValue, currentValue)
        // if (currentValue === '0' || (operator && previousValue === currentValue)) {
        if (currentValue === '0') {
            currentValue = number;
        } else {
            currentValue += number;
        }
    }

    function handleAction(action) {
        switch (action) {
            case 'clear':
                currentValue = '0';
                previousValue = '';
                operator = null;
                break;
            case 'backspace':
                if (currentValue.length > 1) {
                    if(operator) {
                        operator = null
                    }
                    currentValue = currentValue.slice(0, -1);
                } else {
                    currentValue = '0';
                }
                break;
            case 'square':
                calculate();
                currentValue = String(Math.pow(parseFloat(currentValue), 2));
                operator = null
                break;
            case 'sqrt':
                calculate();
                currentValue = String(Math.sqrt(parseFloat(currentValue)));
                operator = null
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                console.log(operator)
                // если уже есть какой-то знак
                if(operator) {
                    const parts = currentValue.split(getOperatorSymbol(operator));
                // debugger
                    if (parts[1] || parts[1] === '0') { 
                        calculate();
                    }
                    //замена знака
                    // Если последний символ - это оператор
                    if (['+', '-', '*', '/'].includes(currentValue[currentValue.length-1])) {
                    // if (operator !== action) {
                        currentValue = currentValue.substring(0, currentValue.length - 1) + getOperatorSymbol(action)
                    }
                    else {
                        currentValue = currentValue + getOperatorSymbol(action)
                    }
                    operator = action
                }
                else {
                    if(currentValue === '0' && action === 'subtract') {
                        currentValue = '-'
                    } else {
                        currentValue = currentValue + getOperatorSymbol(action)
                        operator = action
                    }
                }
                // если повторно нажали на действие
                // if (operator) {
                //     // console.log(currentValue)
                //     // debugger
                //     const parts = currentValue.split(getOperatorSymbol(operator));
                //     if (parts[1] || parts[1] === '0') { 
                //         calculate();
                //         operator = action;
                //         break;
                //     }
                //     if (operator !== action) {
                //         console.log('123213')
                //         // замена оператора
                //         if(currentValue[0] !== '-') {
                //             currentValue = currentValue + getOperatorSymbol(action)
                //         } else currentValue = currentValue.substring(0, currentValue.length - 1) + getOperatorSymbol(action)
    
                //         operator = action
                //     }
                //     operator = action;
                // }
                // else {
                //     if(currentValue === '0' && action === 'subtract') {
                //         currentValue = '-'
                //     } else {
                //         currentValue = currentValue + getOperatorSymbol(action)
                //         operator = action
                //     }
                // }
                // if (!operator) { 
                // }
                
                // } else {
                //     operator = action;
                // }
                break;
            case 'decimal':
                if (canAddDecimal(currentValue)) {
                    currentValue += '.';
                }
                break;
            case 'equals':
                if (operator) {
                    calculate();
                    operator = null;
                }
                break;
            default:
                break;
        }
    }

    function calculate() {
        const operatorSymbol = getOperatorSymbol(operator);
        let isNegative = false
        if(currentValue[0] === '-') {
            currentValue = currentValue.slice(1)
            isNegative = true
        }
        const parts = currentValue.split(operatorSymbol);
        if (parts.length < 2 || !parts[1]) return;
        const prev = isNegative ?  -1 * parseFloat(parts[0]) : parseFloat(parts[0]);
        // const prev = parseFloat(parts[0])
        const current = parseFloat(parts[1]);

        switch (operator) {
            case 'add':
                currentValue = String(prev + current);
                break;
            case 'subtract':
                currentValue = String(prev - current);
                break;
            case 'multiply':
                currentValue = String(prev * current);
                break;
            case 'divide':
                if(current === 0) {
                    alert('На ноль делить нельзя')
                    currentValue = String(prev);
                    break
                  }
                currentValue = String(prev / current);
                break;
        }
        // previousValue = currentValue;
    }

    function getOperatorSymbol(action) {
        switch (action) {
            case 'add':
                return '+';
            case 'subtract':
                return '-';
            case 'multiply':
                return '*';
            case 'divide':
                return '/';
            default:
                return '';
        }
    }

    function updateDisplay() {
        display.textContent = currentValue;
    }

    function canAddDecimal(value) {
        const operatorSymbol = ['+', '-', '*', '/'].find(op => value.includes(op));
        if (!operatorSymbol) {
            return !value.includes('.');
        }
        const parts = value.split(operatorSymbol);
        const currentPart = parts[parts.length - 1];
        if(!currentPart) return false
        return !currentPart.includes('.');
    }
});
