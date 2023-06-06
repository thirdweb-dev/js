export { normalizeChainId } from "./normalizeChainId";

export {
  RpcError,
  ProviderRpcError,
  AddChainError,
  ChainNotConfiguredError,
  ConnectorNotFoundError,
  ResourceUnavailableError,
  SwitchChainError,
  SwitchChainNotSupportedError,
  UserRejectedRequestError,
} from "./errors";
export type { EthersError } from "./errors";

export { WagmiConnector, type WagmiConnectorData } from "../wagmi-connectors";
