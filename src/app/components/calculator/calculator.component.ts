import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  expression: string = '';
  lastInput: string = '';

  clearDisplay() {
    this.expression = '';
    this.lastInput = '';
  }

  deleteLast() {
    if (this.lastInput === 'operator') {
      this.expression = this.expression.slice(0, -3);
    } else {
      this.expression = this.expression.slice(0, -1);
    }
    this.lastInput = '';
  }

  toggleSign() {
    if (this.expression) {
      if (this.expression.charAt(0) === '-') {
        this.expression = this.expression.slice(1);
      } else {
        this.expression = '-' + this.expression;
      }
    }
  }

  appendNumber(number: string) {
    this.expression += number;
    this.lastInput = 'number';
  }

  appendOperator(op: string) {
    if (this.lastInput === 'operator') {
      this.expression = this.expression.slice(0, -3);
    }
    if (this.expression === '' && op === '-') {
      this.expression = '-';
      this.lastInput = 'number';
      return;
    }
    if (this.expression === '') return;
    this.expression += ' ' + op + ' ';
    this.lastInput = 'operator';
  }

  calculate() {
    try {
      this.expression = this.evaluateExpression(this.expression).toString();
      this.lastInput = 'number';
    } catch (e) {
      this.expression = 'Error';
    }
  }

  private evaluateExpression(expr: string): number {
    // Replace operators with their JavaScript equivalents
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/');

    // Split the expression into tokens
    const tokens = expr.split(' ').filter(token => token.trim() !== '');
    const values: number[] = [];
    const operators: string[] = [];

    const precedence: { [key: string]: number } = {
      '+': 1,
      '-': 1,
      '×': 2,
      '÷': 2
    };

    const applyOperator = (operator: string) => {
      const right = values.pop()!;
      const left = values.pop()!;
      switch (operator) {
        case '+':
          values.push(left + right);
          break;
        case '-':
          values.push(left - right);
          break;
        case '*':
          values.push(left * right);
          break;
        case '/':
          values.push(left / right);
          break;
      }
    };

    for (const token of tokens) {
      if (!isNaN(Number(token))) {
        values.push(Number(token));
      } else {
        while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
          applyOperator(operators.pop()!);
        }
        operators.push(token);
      }
    }

    while (operators.length) {
      applyOperator(operators.pop()!);
    }

    return values[0];
  }
}
