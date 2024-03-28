/* eslint-disable @typescript-eslint/ban-ts-comment */

// source code of yocto-queue + modified to add types
// https://github.com/sindresorhus/yocto-queue
class Node<T> {
  value: T;
  next: Node<T> | undefined;

  constructor(value: T) {
    this.value = value;
  }
}

class Queue<T> {
  private head: Node<T> | undefined;
  private tail: Node<T> | undefined;
  size: number;

  constructor() {
    this.clear();
    this.size = 0;
  }

  enqueue(value: T) {
    const node = new Node(value);

    if (this.head) {
      if (this.tail) {
        this.tail.next = node;
      }
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
    }

    this.size++;
  }

  dequeue() {
    const current = this.head;
    if (!current) {
      return;
    }

    this.head = this.head?.next;
    this.size--;
    return current.value;
  }

  clear() {
    this.head = undefined;
    this.tail = undefined;
    this.size = 0;
  }

  *[Symbol.iterator]() {
    let current = this.head;

    while (current) {
      yield current.value;
      current = current.next;
    }
  }
}

// source code of p-limit - https://github.com/sindresorhus/p-limit/ + modified to add types
const AsyncResource = {
  bind(fn: () => void, _type?: any, thisArg?: any) {
    return fn.bind(thisArg);
  },
};

type LimitFunctionCallSignature = {
  /**
   * @param fn - Promise-returning/async function.
   * @param arguments - Any arguments to pass through to `fn`. Support for passing arguments on to the `fn` is provided in order to be able to avoid creating unnecessary closures. You probably don't need this optimization unless you're pushing a lot of functions.
   * @returns The promise returned by calling `fn(...arguments)`.
   */
  <Arguments extends unknown[], ReturnType>(
    fn: (...arguments_: Arguments) => PromiseLike<ReturnType> | ReturnType,
    ...arguments_: Arguments
  ): Promise<ReturnType>;
};

export type LimitFunction = {
  /**
   * The number of promises that are currently running.
   */
  readonly activeCount: number;

  /**
   * The number of promises that are waiting to run (i.e. their internal `fn` was not called yet).
   */
  readonly pendingCount: number;

  /**
   * Discard pending promises that are waiting to run.
   *
   * This might be useful if you want to teardown the queue at the end of your program's lifecycle or discard any function calls referencing an intermediary state of your app.
   *
   * Note: This does not cancel promises that are already running.
   */
  clearQueue: () => void;
} & LimitFunctionCallSignature;

type Fn = () => void;

/**
 * Run multiple promise-returning & async functions with limited concurrency.
 * @param concurrency
 * @internal
 */
export function pLimit(concurrency: number): LimitFunction {
  if (
    !(
      (Number.isInteger(concurrency) ||
        concurrency === Number.POSITIVE_INFINITY) &&
      concurrency > 0
    )
  ) {
    throw new TypeError("Expected `concurrency` to be a number from 1 and up");
  }

  const queue = new Queue<Fn>();
  let activeCount = 0;

  const next = () => {
    activeCount--;

    if (queue.size > 0) {
      const fn = queue.dequeue();
      if (fn) {
        fn();
      }
    }
  };

  const run = async (function_: Fn, resolve: any, arguments_: any[]) => {
    activeCount++;

    // @ts-ignore
    const result = (async () => function_(...arguments_))();

    resolve(result);

    try {
      await result;
    } catch {}

    next();
  };

  const enqueue = (function_: Fn, resolve: any, arguments_: any[]) => {
    queue.enqueue(
      AsyncResource.bind(run.bind(undefined, function_, resolve, arguments_)),
    );

    (async () => {
      // This function needs to wait until the next microtask before comparing
      // `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
      // when the run function is dequeued and called. The comparison in the if-statement
      // needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
      await Promise.resolve();

      if (activeCount < concurrency && queue.size > 0) {
        const fn = queue.dequeue();
        if (fn) {
          fn();
        }
      }
    })();
  };

  const generator: LimitFunctionCallSignature = (function_, ...arguments_) =>
    new Promise((resolve) => {
      enqueue(function_, resolve, arguments_);
    });

  Object.defineProperties(generator, {
    activeCount: {
      get: () => activeCount,
    },
    pendingCount: {
      get: () => queue.size,
    },
    clearQueue: {
      value() {
        queue.clear();
      },
    },
  });

  return generator as LimitFunction;
}
