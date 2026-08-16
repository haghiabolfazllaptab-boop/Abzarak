// Safe arithmetic evaluator (no eval). Supports + - * / , parentheses,
// decimals and a postfix % (divide preceding value by 100).

type Token =
  | { type: 'num'; value: number }
  | { type: 'op'; value: string }
  | { type: 'paren'; value: '(' | ')' }
  | { type: 'percent' };

export class CalcError extends Error {}

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = input.replace(/\s+/g, '');
  while (i < s.length) {
    const ch = s[i];
    if (/[0-9.]/.test(ch)) {
      let num = '';
      while (i < s.length && /[0-9.]/.test(s[i])) {
        num += s[i];
        i += 1;
      }
      if ((num.match(/\./g) || []).length > 1) throw new CalcError('عبارت نامعتبر است.');
      tokens.push({ type: 'num', value: Number(num) });
      continue;
    }
    if ('+-*/'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i += 1;
      continue;
    }
    if (ch === '%') {
      tokens.push({ type: 'percent' });
      i += 1;
      continue;
    }
    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch });
      i += 1;
      continue;
    }
    throw new CalcError('عبارت نامعتبر است.');
  }
  return tokens;
}

const PRECEDENCE: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };

function toRPN(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const stack: Token[] = [];
  let prev: Token | null = null;

  for (const tok of tokens) {
    if (tok.type === 'num') {
      output.push(tok);
    } else if (tok.type === 'percent') {
      output.push(tok);
    } else if (tok.type === 'op') {
      // unary minus / plus
      const isUnary =
        !prev ||
        (prev.type === 'op') ||
        (prev.type === 'paren' && prev.value === '(');
      if (isUnary && (tok.value === '-' || tok.value === '+')) {
        output.push({ type: 'num', value: 0 });
      }
      while (
        stack.length &&
        stack[stack.length - 1].type === 'op' &&
        PRECEDENCE[(stack[stack.length - 1] as { value: string }).value] >=
          PRECEDENCE[tok.value]
      ) {
        output.push(stack.pop()!);
      }
      stack.push(tok);
    } else if (tok.value === '(') {
      stack.push(tok);
    } else {
      while (stack.length && !(stack[stack.length - 1].type === 'paren')) {
        output.push(stack.pop()!);
      }
      if (!stack.length) throw new CalcError('پرانتز نامتوازن است.');
      stack.pop();
    }
    prev = tok;
  }
  while (stack.length) {
    const t = stack.pop()!;
    if (t.type === 'paren') throw new CalcError('پرانتز نامتوازن است.');
    output.push(t);
  }
  return output;
}

export function evaluate(input: string): number {
  if (!input.trim()) throw new CalcError('عبارتی وارد نشده است.');
  const rpn = toRPN(tokenize(input));
  const stack: number[] = [];
  for (const tok of rpn) {
    if (tok.type === 'num') {
      stack.push(tok.value);
    } else if (tok.type === 'percent') {
      if (!stack.length) throw new CalcError('عبارت نامعتبر است.');
      stack.push(stack.pop()! / 100);
    } else if (tok.type === 'op') {
      const b = stack.pop();
      const a = stack.pop();
      if (a === undefined || b === undefined) throw new CalcError('عبارت نامعتبر است.');
      switch (tok.value) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/':
          if (b === 0) throw new CalcError('امکان تقسیم بر صفر وجود ندارد.');
          stack.push(a / b);
          break;
      }
    }
  }
  if (stack.length !== 1) throw new CalcError('عبارت نامعتبر است.');
  const result = stack[0];
  if (!isFinite(result)) throw new CalcError('این مقدار قابل محاسبه نیست.');
  return result;
}
