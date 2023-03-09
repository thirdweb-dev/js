export { normalizeChainId } from "./normalizeChainId";

export {
  RpcError,
  ProviderRpcError,
  AddChainError,
  ChainDoesNotSupportMulticallError,
  ChainMismatchError,
  ChainNotConfiguredError,
  ConnectorAlreadyConnectedError,
  ConnectorNotFoundError,
  ContractMethodDoesNotExistError,
  ContractMethodNoResultError,
  ContractMethodRevertedError,
  ContractResultDecodeError,
  ProviderChainsNotFound,
  ResourceUnavailableError,
  SwitchChainError,
  SwitchChainNotSupportedError,
  UserRejectedRequestError,
} from "./errors";
export type { EthersError } from "./errors";
export { getClient } from "./getClient";
export { getProvider } from "./getProvider";

// TODO remove unused exports from ./errors

export type {
  Ethereum,
  InjectedConnectorOptions,
  ConnectorData,
  Address,
} from "@wagmi/core";
export { Connector } from "../wagmi-connectors";
