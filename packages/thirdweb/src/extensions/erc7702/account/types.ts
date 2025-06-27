/* ────────────────────────────────
   Enums
   ──────────────────────────────── */

export enum LimitType {
  Unlimited = 0,
  Lifetime = 1,
  Allowance = 2,
}

export enum Condition {
  Unconstrained = 0,
  Equal = 1,
  Greater = 2,
  Less = 3,
  GreaterOrEqual = 4,
  LessOrEqual = 5,
  NotEqual = 6,
}

/* ────────────────────────────────
   Input types
   ──────────────────────────────── */

/* ---------- UsageLimit ---------- */
interface UsageLimitInput {
  limitType: LimitType;
  limit: bigint;
  period: bigint;
}

/* ---------- Constraint ---------- */
interface ConstraintInput {
  condition: Condition;
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
