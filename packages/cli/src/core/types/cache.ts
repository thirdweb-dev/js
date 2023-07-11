export type CacheEntry = {
  isCached: boolean;
  key: string;
  value: string;
};

export interface CacheType {
  clear(): void;
  has(key: string): boolean;
  get(key: string): { key: string; value: string; isCached: boolean; };
  set(key: string, value: string): string;
  remove(key: string): boolean;
  pathFor(key: string): string;
  decompress(value: string): string;
  compress(value: string): string;
}