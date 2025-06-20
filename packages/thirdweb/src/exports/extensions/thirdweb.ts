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

export {
  type GetAllPublishedContractsParams,
  getAllPublishedContracts,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/read/getAllPublishedContracts.js";
export {
  type GetPublishedContractParams,
  getPublishedContract,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/read/getPublishedContract.js";
export {
  type GetPublishedContractVersionsParams,
  getPublishedContractVersions,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/read/getPublishedContractVersions.js";
export {
  type GetPublishedUriFromCompilerUriParams,
  getPublishedUriFromCompilerUri,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/read/getPublishedUriFromCompilerUri.js";
// Read
export {
  type GetPublisherProfileUriParams,
  getPublisherProfileUri,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/read/getPublisherProfileUri.js";

// Write
export {
  type SetPublisherProfileUriParams,
  setPublisherProfileUri,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/write/setPublisherProfileUri.js";
export {
  type UnpublishContractParams,
  unpublishContract,
} from "../../extensions/thirdweb/__generated__/IContractPublisher/write/unpublishContract.js";

export {
  getContractPublisher,
  type PublishContractParams,
  publishContract,
} from "../../extensions/thirdweb/write/publish.js";

// --------------------------------------------------------
// Multichain Registry
// --------------------------------------------------------

// --------------------------------------------------------
// Contract Factory
// --------------------------------------------------------
export {
  type DeployProxyByImplementationParams,
  deployProxyByImplementation,
} from "../../extensions/thirdweb/__generated__/IContractFactory/write/deployProxyByImplementation.js";
// Read
export {
  type CountParams,
  count,
} from "../../extensions/thirdweb/__generated__/ITWMultichainRegistry/read/count.js";
export {
  type GetAllParams,
  getAll,
} from "../../extensions/thirdweb/__generated__/ITWMultichainRegistry/read/getAll.js";
export {
  type GetMetadataUriParams,
  getMetadataUri,
} from "../../extensions/thirdweb/__generated__/ITWMultichainRegistry/read/getMetadataUri.js";
// Write
export {
  type AddParams,
  add,
} from "../../extensions/thirdweb/__generated__/ITWMultichainRegistry/write/add.js";
export {
  type RemoveParams,
  remove,
} from "../../extensions/thirdweb/__generated__/ITWMultichainRegistry/write/remove.js";
