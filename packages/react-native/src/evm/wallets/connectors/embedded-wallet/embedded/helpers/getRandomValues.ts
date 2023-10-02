type IntArrayBufferView =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array[];

export function getRandomValues<T extends IntArrayBufferView>(array: T): T {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore getRandomValues is polyfilled
  return crypto.getRandomValues(array);
}
