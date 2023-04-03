export const CloneFactory = {
  name: "TWCloneFactory" as const,
  contractType: "cloneFactory" as const,
};

export const NativeTokenWrapper = {
  name: "WETH9" as const,
  contractType: "nativeTokenWrapper" as const,
};

export const Forwarder = {
  name: "Forwarder" as const,
  contractType: "forwarder" as const,
};

export const EOAForwarder = {
  name: "ForwarderEOAOnly" as const,
  contractType: "eoaForwarder" as const,
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
