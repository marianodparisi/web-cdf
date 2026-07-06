import { PassThrough } from 'node:stream';

export const stabilizeNodeStdin = () => {
  const descriptor = Object.getOwnPropertyDescriptor(process, 'stdin');

  if (!descriptor?.get || !descriptor.configurable) return;

  const stdin = new PassThrough();
  stdin.pause();
  Object.defineProperties(stdin, {
    fd: { value: 0 },
    isTTY: { value: false },
  });

  Object.defineProperty(process, 'stdin', {
    value: stdin,
    enumerable: true,
    configurable: true,
  });
};
