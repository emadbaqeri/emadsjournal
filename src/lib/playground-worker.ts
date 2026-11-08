import { transform } from 'sucrase';

interface RunRequest {
  id: number;
  code: string;
}

interface RunSuccess {
  id: number;
  ok: true;
  output: string;
}

interface RunFailure {
  id: number;
  ok: false;
  error: string;
}

function blocked(): never {
  throw new Error('This playground cannot use the network.');
}

function serialize(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return String(value);
  }
  if (typeof value === 'undefined') return 'undefined';
  if (typeof value === 'bigint') return `${value}n`;
  try {
    return JSON.stringify(value);
  } catch {
    return Object.prototype.toString.call(value);
  }
}

const sandboxConsole = {
  log: (...args: unknown[]) => logs.push(args.map(serialize).join(' ')),
  info: (...args: unknown[]) => logs.push(args.map(serialize).join(' ')),
  warn: (...args: unknown[]) => logs.push(args.map(serialize).join(' ')),
  error: (...args: unknown[]) => logs.push(args.map(serialize).join(' ')),
};

let logs: string[] = [];

self.onmessage = (event: MessageEvent<RunRequest>) => {
  const { id, code } = event.data;
  logs = [];
  try {
    const js = transform(code, { transforms: ['typescript'] }).code;
    const run = new Function(
      'console',
      'fetch',
      'XMLHttpRequest',
      'WebSocket',
      'Worker',
      'importScripts',
      `"use strict";\n${js}`,
    );
    run(sandboxConsole, blocked, blocked, blocked, blocked, blocked);
    const message: RunSuccess = {
      id,
      ok: true,
      output: logs.join('\n') || '(no output)',
    };
    self.postMessage(message);
  } catch (error) {
    const message: RunFailure = {
      id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
    self.postMessage(message);
  }
};
