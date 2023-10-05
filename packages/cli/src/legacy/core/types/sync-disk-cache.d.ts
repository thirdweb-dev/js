declare module 'sync-disk-cache' {
  export type CacheEntry = {
    isCached: boolean;
    key: string;
    value: string;
  };

  export default class Cache {
    constructor(key: string, options?: { location?: string; compression?: "gzip" | "deflate" | "deflateRaw"; });
    clear(): void;
    has(key: string): boolean;
    get(key: string): CacheEntry;
    set(key: string, value: string): string;
    remove(key: string): boolean;
    pathFor(key: string): string;
    decompress(value: string): string;
    compress(value: string): string;
  }
}

declare module "solc"