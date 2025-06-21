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
      color: "secondaryText",
      status: "Unknown",
    };
  }

  const subStatus = cryptoStatus.subStatus;
  const status = cryptoStatus.status;

  if (subStatus === "WAITING_BRIDGE") {
    return {
      color: "accentText",
      loading: true,
      status: "Bridging",
    };
  }

  if (subStatus === "PARTIAL_SUCCESS") {
    return {
      color: "secondaryText",
      status: "Incomplete",
    };
  }

  if (status === "PENDING") {
    return {
      color: "accentText",
      loading: true,
      status: "Pending",
    };
  }

  if (status === "FAILED") {
    return {
      color: "danger",
      status: "Failed",
    };
  }

  if (status === "COMPLETED") {
    return {
      color: "success",
      status: "Completed",
    };
  }

  return {
    color: "secondaryText",
    status: "Unknown",
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
