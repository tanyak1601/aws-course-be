/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyFunction = (...args: any[]) => any;

export function asyncPipe(...fns: AnyFunction[]) {
  return (x: any) =>
    fns.reduce((y, fn) => {
      return y instanceof Promise ? y.then((yr) => fn(yr)) : fn(y);
    }, x);
}
