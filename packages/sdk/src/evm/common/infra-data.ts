import InfraData from "./InfraData.json";

type InfraTxInfo = {
  predictedAddress: string;
  tx: string;
  from: string;
  deployData: string;
};

export const CloneFactory = {
  name: "TWStatelessFactory" as const,
  contractType: "cloneFactory" as const,
  txInfo: InfraData["cloneFactory"] as InfraTxInfo,
};

export const NativeTokenWrapper = {
  name: "WETH9" as const,
  contractType: "nativeTokenWrapper" as const,
  txInfo: InfraData["nativeTokenWrapper"] as InfraTxInfo,
};

export const Forwarder = {
  name: "Forwarder" as const,
  contractType: "forwarder" as const,
  txInfo: InfraData["forwarder"] as InfraTxInfo,
};

export const EOAForwarder = {
  name: "ForwarderEOAOnly" as const,
  contractType: "eoaForwarder" as const,
  txInfo: InfraData["eoaForwarder"] as InfraTxInfo,
};

/**
 * @internal
 */
export const INFRA_CONTRACTS_MAP = {
  [CloneFactory.contractType]: CloneFactory,
  [NativeTokenWrapper.contractType]: NativeTokenWrapper,
  [Forwarder.contractType]: Forwarder,
  [EOAForwarder.contractType]: EOAForwarder,
} as const;
