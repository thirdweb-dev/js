// --------------------------------------------------------
// Generic
// --------------------------------------------------------

// Read
export {
  contractType,
  isContractTypeSupported,
} from "../../extensions/thirdweb/read/contractType.js";

// --------------------------------------------------------
// Publisher contract
// --------------------------------------------------------

// Read
export {
  getPublisherProfileUri,
  type GetPublisherProfileUriParams,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/read/getPublisherProfileUri.js";
export {
  getPublishedUriFromCompilerUri,
  type GetPublishedUriFromCompilerUriParams,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/read/getPublishedUriFromCompilerUri.js";
export {
  getAllPublishedContracts,
  type GetAllPublishedContractsParams,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/read/getAllPublishedContracts.js";
export {
  getPublishedContract,
  type GetPublishedContractParams,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/read/getPublishedContract.js";
export {
  getPublishedContractVersions,
  type GetPublishedContractVersionsParams,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/read/getPublishedContractVersions.js";

// Write
export {
  setPublisherProfileUri,
  type SetPublisherProfileUriParams,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/write/setPublisherProfileUri.js";
export {
  unpublishContract,
  type UnpublishContractParams,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/write/unpublishContract.js";

export {
  publishContract,
  type PublishContractParams,
  getContractPublisher,
} from "../../extensions/thirdweb/write/publish.js";

// --------------------------------------------------------
// Multichain Registry
// --------------------------------------------------------

// Read
export {
  count,
  type CountParams,
} from "../../extensions/thirdweb/__generated__/ITWMultichainRegistry/read/count.js";
export {
  getAll,
  type GetAllParams,
} from "../../extensions/thirdweb/__generated__/ITWMultichainRegistry/read/getAll.js";
export {
  getMetadataUri,
  type GetMetadataUriParams,
} from "../../extensions/thirdweb/__generated__/ITWMultichainRegistry/read/getMetadataUri.js";

// Write
export {
  add,
  type AddParams,
} from "../../extensions/thirdweb/__generated__/ITWMultichainRegistry/write/add.js";
export {
  remove,
  type RemoveParams,
} from "../../extensions/thirdweb/__generated__/ITWMultichainRegistry/write/remove.js";

// --------------------------------------------------------
// Contract Factory
// --------------------------------------------------------
export {
  deployProxyByImplementation,
  type DeployProxyByImplementationParams,
} from "../../extensions/thirdweb/__generated__/IContractFactory/write/deployProxyByImplementation.js";
