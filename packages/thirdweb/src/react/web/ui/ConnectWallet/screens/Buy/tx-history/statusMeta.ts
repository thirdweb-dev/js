import type { BuyWithCryptoStatus } from "../../../../../../../pay/buyWithCrypto/getStatus.js";
import type { BuyWithFiatStatus } from "../../../../../../../pay/buyWithFiat/getStatus.js";
import type { Theme } from "../../../../design-system/index.js";
import type { ConnectLocale } from "../../../locale/types.js";

export type StatusMeta = {
  status: string;
  color: keyof Theme["colors"];
  loading?: true;
};

export function getBuyWithCryptoStatusMeta(
  cryptoStatus: BuyWithCryptoStatus,
  connectLocale: ConnectLocale,
): StatusMeta {
  const locale = connectLocale.pay;
  if (cryptoStatus.status === "NOT_FOUND") {
    return {
      status: locale.unknown,
      color: "secondaryText",
    };
  }

  const subStatus = cryptoStatus.subStatus;
  const status = cryptoStatus.status;

  if (subStatus === "WAITING_BRIDGE") {
    return {
      status: locale.bridging,
      color: "accentText",
      loading: true,
    };
  }

  if (subStatus === "PARTIAL_SUCCESS") {
    return {
      status: locale.incomplete,
      color: "secondaryText",
    };
  }

  if (status === "PENDING") {
    return {
      status: locale.pending,
      color: "accentText",
      loading: true,
    };
  }

  if (status === "FAILED") {
    return {
      status: locale.failed,
      color: "danger",
    };
  }

  if (status === "COMPLETED") {
    return {
      status: locale.completed,
      color: "success",
    };
  }

  return {
    status: locale.unknown,
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
  connectLocale: ConnectLocale,
): FiatStatusMeta {
  const status = fiatStatus.status;
  const locale = connectLocale.pay;

  switch (status) {
    case "CRYPTO_SWAP_FALLBACK": {
      return {
        status: locale.incomplete,
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
        status: locale.pending,
        color: "accentText",
        loading: true,
        step: status === "CRYPTO_SWAP_IN_PROGRESS" ? 2 : 1,
        progressStatus: "pending",
      };
    }

    case "ON_RAMP_TRANSFER_COMPLETED":
    case "CRYPTO_SWAP_COMPLETED": {
      return {
        status: locale.completed,
        color: "success",
        loading: true,
        step: status === "CRYPTO_SWAP_COMPLETED" ? 2 : 1,
        progressStatus: "completed",
      };
    }

    case "CRYPTO_SWAP_FAILED":
    case "CRYPTO_SWAP_REQUIRED": {
      return {
        status: locale.actionRequired,
        color: "accentText",
        step: 2,
        progressStatus: "actionRequired",
      };
    }

    case "PAYMENT_FAILED":
    case "ON_RAMP_TRANSFER_FAILED": {
      return {
        status: locale.failed,
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
