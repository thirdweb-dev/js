export {
  getContract,
  type ContractOptions,
  type ThirdwebContract,
} from "../contract/contract.js";

export {
  resolveContractAbi,
  resolveAbiFromBytecode,
  resolveAbiFromContractApi,
  resolveCompositeAbi,
} from "../contract/actions/resolve-abi.js";

export { formatCompilerMetadata } from "../contract/actions/compiler-metadata.js";

export { getBytecode } from "../contract/actions/get-bytecode.js";

// verification
export {
  verifyContract,
  checkVerificationStatus,
} from "../contract/verification/index.js";

// publisher
export {
  fetchPublishedContract,
  fetchPublishedContractMetadata,
  fetchDeployBytecodeFromPublishedContractMetadata,
} from "../contract/deployment/publisher.js";

// deployment - TODO: these end up looking more like extensions -> should they be?
export {
  prepareDirectDeployTransaction,
  type PrepareDirectDeployTransactionOptions,
} from "../contract/deployment/deploy-with-abi.js";
export { prepareAutoFactoryDeployTransaction } from "../contract/deployment/deploy-via-autofactory.js";
