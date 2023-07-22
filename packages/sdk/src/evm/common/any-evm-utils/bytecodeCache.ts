// Internal static cache
const bytecodeCache: Record<string, string> = {};

function getCacheKey(address: string, chainId: number) {
  return `${address}-${chainId}`;
}

function putBytecodeInCache(
  address: string,
  chainId: number,
  bytecode: string,
) {
  bytecodeCache[getCacheKey(address, chainId)] = bytecode;
}

function getBytecodeFromCache(address: string, chainId: number) {
  return bytecodeCache[getCacheKey(address, chainId)];
}
