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

// TODO remove unused exports from ./errors
export { Connector, type ConnectorData } from "../wagmi-connectors";
