type GenericEmitterType = {
  [key: string]: unknown;
};

export type Emitter<T extends GenericEmitterType> = {
  subscribe<K extends keyof T>(event: K, cb: (data: T[K]) => void): () => void;
  emit<K extends keyof T>(event: K, data: T[K]): void;
};

/**
 * Creates an emitter object that allows subscribing to events and emitting events.
 * @returns An emitter object with `subscribe` and `emit` methods.
 * @template TEmitter - The type of the emitter.
 * @example
 * ```ts
 * const emitter = createEmitter<{
 *  event1: string;
 * event2: number;
 * }>();
 *
 * emitter.subscribe("event1", (data) => {
 * console.log(data); // "hello"
 * });
 *
 * emitter.emit("event1", "hello");
 * ```
 */
export function createEmitter<
  const TEmitter extends GenericEmitterType,
>(): Emitter<TEmitter> {
  const subsribers = new Map<
    keyof TEmitter,
    // biome-ignore lint/suspicious/noExplicitAny: TODO: fix any
    Set<(data: any) => void>
  >();

  return {
    subscribe(event, cb) {
      if (!subsribers.has(event)) {
        subsribers.set(event, new Set([cb]));
      } else {
        subsribers.get(event)?.add(cb);
      }

      return () => {
        const subscribers = subsribers.get(event);
        if (subscribers) {
          subscribers.delete(cb);
        }
      };
    },
    emit(event, data) {
      const subscribers = subsribers.get(event);
      if (subscribers) {
        for (const cb of subscribers) {
          cb(data);
        }
      }
    },
  };
}
