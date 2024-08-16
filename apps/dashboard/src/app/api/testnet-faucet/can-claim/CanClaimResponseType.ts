export type CanClaimResponseType =
  | {
      canClaim: boolean;
      ttlSeconds: number;
      type: "throttle";
    }
  | {
      canClaim: false;
      type: "unsupported-chain";
    };
