import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import type { BuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
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
    | "partialSuccess"
    | "unknown";
};
export function getBuyWithFiatStatusMeta(
  fiatStatus: BuyWithFiatStatus,
): FiatStatusMeta {
  const status = fiatStatus.status;

  switch (status) {
    case "CRYPTO_SWAP_FALLBACK": {
      return {
        status: "Incomplete",
        color: "danger",
        step: 2,
        progressStatus: "partialSuccess",
      };
    }

    case "CRYPTO_SWAP_IN_PROGRESS":
    case "PENDING_ON_RAMP_TRANSFER":
    case "ON_RAMP_TRANSFER_IN_PROGRESS":
    case "PENDING_PAYMENT": {
      return {
        status: "Pending",
        color: "accentText",
        loading: true,
        step: status === "CRYPTO_SWAP_IN_PROGRESS" ? 2 : 1,
        progressStatus: "pending",
      };
    }

    case "ON_RAMP_TRANSFER_COMPLETED":
    case "CRYPTO_SWAP_COMPLETED": {
      return {
        status: "Completed", // Is this actually completed though?
        color: "success",
        loading: true,
        step: status === "CRYPTO_SWAP_COMPLETED" ? 2 : 1,
        progressStatus: "completed",
      };
    }

    case "CRYPTO_SWAP_FAILED":
    case "CRYPTO_SWAP_REQUIRED": {
      return {
        status: "Action Required",
        color: "accentText",
        step: 2,
        progressStatus: "actionRequired",
      };
    }

    case "PAYMENT_FAILED":
    case "ON_RAMP_TRANSFER_FAILED": {
      return {
        status: "Failed",
        color: "danger",
        step: 1,
        progressStatus: "failed",
      };
    }
  }

  return {
    status: "Unknown",
    color: "secondaryText",
    step: 1,
    progressStatus: "unknown",
  };
}
