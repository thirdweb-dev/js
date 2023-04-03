import { PrecomputedDeploymentData } from "../types/any-evm/deploy-data";
import InfraData from "./InfraData.json";

export const CloneFactory = {
  name: "TWCloneFactory" as const,
  contractType: "cloneFactory" as const,
  txInfo: InfraData["cloneFactory"] as PrecomputedDeploymentData,
};

export const NativeTokenWrapper = {
  name: "WETH9" as const,
  contractType: "nativeTokenWrapper" as const,
  txInfo: InfraData["nativeTokenWrapper"] as PrecomputedDeploymentData,
};

export const Forwarder = {
  name: "Forwarder" as const,
  contractType: "forwarder" as const,
  txInfo: InfraData["forwarder"] as PrecomputedDeploymentData,
};

export const EOAForwarder = {
  name: "ForwarderEOAOnly" as const,
  contractType: "eoaForwarder" as const,
  txInfo: InfraData["eoaForwarder"] as PrecomputedDeploymentData,
};

/**
 * @internal
 */
export const INFRA_CONTRACTS_MAP = {
  [NativeTokenWrapper.contractType]: NativeTokenWrapper,
  [Forwarder.contractType]: Forwarder,
  [EOAForwarder.contractType]: EOAForwarder,
  [CloneFactory.contractType]: CloneFactory,
} as const;
