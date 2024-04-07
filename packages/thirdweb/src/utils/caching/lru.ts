/**
 * Represents a Least Recently Used (LRU) Map.
 * Extends the built-in Map class.
 */
export class LruMap<value = unknown> extends Map<string, value> {
  maxSize: number;

  /**
   *
   * @param size
   * @internal
   */
  constructor(size: number) {
    super();
    this.maxSize = size;
  }

  /**
   *
   * @param key
   * @param value
   * @internal
   */
  override set(key: string, value: value) {
    super.set(key, value);
    if (this.maxSize && this.size > this.maxSize) {
      this.delete(this.keys().next().value);
    }
    return this;
  }
}
