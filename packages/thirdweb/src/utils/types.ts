export type OmitOverlap<T, K> = T extends any
  ? { [P in Exclude<keyof T, K>]: T[P] }
  : never;

export type MakeOverlapOptional<T, K> = OmitOverlap<T, K> & Partial<K>;
