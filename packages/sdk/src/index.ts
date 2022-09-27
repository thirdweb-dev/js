// handle browser vs node global
globalThis.global = globalThis;
// export EVM by default
export * from "./evm";
