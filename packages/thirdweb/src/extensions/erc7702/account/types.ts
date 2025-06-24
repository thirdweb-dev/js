/* ────────────────────────────────
   Input types
   ──────────────────────────────── */

/* ---------- UsageLimit ---------- */
export interface UsageLimitInput {
  limitType: number;
  limit: bigint;
  period: bigint;
}

/* ---------- Constraint ---------- */
export interface ConstraintInput {
  condition: number;
  index: bigint;
  refValue: `0x${string}`;
  limit?: UsageLimitInput;
}

/* ---------- CallSpec ---------- */
export interface CallSpecInput {
  target: `0x${string}`;
  selector: `0x${string}`;
  maxValuePerUse?: bigint;
  valueLimit?: UsageLimitInput;
  constraints?: ConstraintInput[];
}

/* ---------- TransferSpec ---------- */
export interface TransferSpecInput {
  target: `0x${string}`;
  maxValuePerUse?: bigint;
  valueLimit?: UsageLimitInput;
}

/* ---------- SessionSpec ---------- */
export interface SessionSpecInput {
  signer: `0x${string}`;
  isWildcard?: boolean;
  expiresAt?: bigint;
  callPolicies?: CallSpecInput[];
  transferPolicies?: TransferSpecInput[];
  uid: `0x${string}`;
}

/* ────────────────────────────────
   EIP-712 structs
   ──────────────────────────────── */

export const UsageLimitRequest = [
  { name: "limitType", type: "uint8" },
  { name: "limit", type: "uint256" },
  { name: "period", type: "uint256" },
] as const;

export const ConstraintRequest = [
  { name: "condition", type: "uint8" },
  { name: "index", type: "uint64" },
  { name: "refValue", type: "bytes32" },
  { name: "limit", type: "UsageLimit" },
] as const;

export const CallSpecRequest = [
  { name: "target", type: "address" },
  { name: "selector", type: "bytes4" },
  { name: "maxValuePerUse", type: "uint256" },
  { name: "valueLimit", type: "UsageLimit" },
  { name: "constraints", type: "Constraint[]" },
] as const;

export const TransferSpecRequest = [
  { name: "target", type: "address" },
  { name: "maxValuePerUse", type: "uint256" },
  { name: "valueLimit", type: "UsageLimit" },
] as const;

export const SessionSpecRequest = [
  { name: "signer", type: "address" },
  { name: "isWildcard", type: "bool" },
  { name: "expiresAt", type: "uint256" },
  { name: "callPolicies", type: "CallSpec[]" },
  { name: "transferPolicies", type: "TransferSpec[]" },
  { name: "uid", type: "bytes32" },
] as const;
