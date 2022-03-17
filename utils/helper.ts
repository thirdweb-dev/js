// `undefined` can possibly be replaced by something else.
export const UNDEFINED: undefined = ({} as any)[0];
export const isUndefined = (v: any): v is undefined => v === UNDEFINED;
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (v: any): v is Function => typeof v === "function";
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
export const mergeObjects = (a: any, b: any) => ({ ...a, ...b });

const STR_UNDEFINED = "undefined";
export const hasWindow = typeof window !== STR_UNDEFINED;
export const hasDocument = typeof document !== STR_UNDEFINED;
