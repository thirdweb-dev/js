(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

console.log(`__tw__${JSON.stringify((globalThis as any).config)}__tw__`);

export {};
