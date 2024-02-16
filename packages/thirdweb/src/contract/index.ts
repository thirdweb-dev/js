export {
  getContract,
  type ContractOptions,
  type ThirdwebContract,
} from "./contract.js";

export {
  resolveContractAbi,
  resolveAbiFromBytecode,
  resolveAbiFromContractApi,
  resolveCompositeAbi,
} from "./actions/resolve-abi.js";

export { formatCompilerMetadata } from "./actions/compiler-metadata.js";

export { getBytecode } from "./actions/get-bytecode.js";

// verification
export {
  verifyContract,
  checkVerificationStatus,
} from "./verification/index.js";

// deployment - TODO: these end up looking more like extensions -> should they be?
export {
  prepareDirectDeployTransaction,
  type PrepareDirectDeployTransactionOptions,
} from "./deployment/deploy-with-abi.js";
export {
  prepareDeployTransactionFromUri,
  type PrepareDeployTransactionFromUriOptions,
} from "./deployment/deploy-from-uri.js";
export {
  prepareDeployTransactionForPublishedContract,
  type PrepareDeployTransactionForPublishedContractOptions,
} from "./deployment/deploy-published.js";
