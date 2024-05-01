import type {
  BuyWithCryptoStatus,
  BuyWithFiatStatus,
} from "../../../../../../../exports/pay.js";
import type { Theme } from "../../../../design-system/index.js";

export type StatusMeta = {
  status: string;
  color: keyof Theme["colors"];
  loading?: true;
};

export function getBuyWithCryptoStatusMeta(
  cryptoStatus: BuyWithCryptoStatus,
): StatusMeta {
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

export function getBuyWithFiatStatusMeta(
  fiatStatus: BuyWithFiatStatus,
): StatusMeta {
  const status = fiatStatus.status;

  switch (status) {
    case "CRYPTO_SWAP_IN_PROGRESS":
    case "PENDING_ON_RAMP_TRANSFER":
    case "ON_RAMP_TRANSFER_IN_PROGRESS":
    case "PENDING_PAYMENT": {
      return {
        status: "Pending",
        color: "accentText",
        loading: true,
      };
    }

    case "ON_RAMP_TRANSFER_COMPLETED":
    case "CRYPTO_SWAP_COMPLETED": {
      return {
        status: "Completed", // Is this actually completed though?
        color: "success",
        loading: true,
      };
    }

    case "CRYPTO_SWAP_FAILED":
    case "CRYPTO_SWAP_REQUIRED": {
      return {
        status: "Action Required",
        color: "accentText",
      };
    }

    case "PAYMENT_FAILED":
    case "ON_RAMP_TRANSFER_FAILED": {
      return {
        status: "Failed",
        color: "danger",
      };
    }
  }

  return {
    status: "Unknown",
    color: "secondaryText",
  };
}
