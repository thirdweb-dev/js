import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import type { Theme } from "../../../../../../core/design-system/index.js";

export type StatusMeta = {
  status: string;
  color: keyof Theme["colors"];
  loading?: true;
};

export function getBuyWithCryptoStatusMeta(
  cryptoStatus: BuyWithCryptoStatus,
): StatusMeta {
  if (cryptoStatus.status === "NOT_FOUND") {
    return {
      status: "Unknown",
      color: "secondaryText",
    };
  }

  const subStatus = cryptoStatus.subStatus;
  const status = cryptoStatus.status;

  if (subStatus === "WAITING_BRIDGE") {
    return {
      status: "Bridging",
      color: "accentText",
      loading: true,
    };
  }

  if (subStatus === "PARTIAL_SUCCESS") {
    return {
      status: "Incomplete",
      color: "secondaryText",
    };
  }

  if (status === "PENDING") {
    return {
      status: "Pending",
      color: "accentText",
      loading: true,
    };
  }

  if (status === "FAILED") {
    return {
      status: "Failed",
      color: "danger",
    };
  }

  if (status === "COMPLETED") {
    return {
      status: "Completed",
      color: "success",
    };
  }

  return {
    status: "Unknown",
    color: "secondaryText",
  };
}

export type FiatStatusMeta = {
  status: string;
  color: keyof Theme["colors"];
  loading?: true;
  step: 1 | 2;
  progressStatus:
    | "pending"
    | "completed"
    | "failed"
    | "actionRequired"
    | "unknown";
};
