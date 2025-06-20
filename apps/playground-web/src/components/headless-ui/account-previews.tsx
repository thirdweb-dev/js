"use client";

import { ethereum } from "thirdweb/chains";
import {
  AccountAvatar,
  AccountBalance,
  type AccountBalanceInfo,
  AccountBlobbie,
  AccountName,
  AccountProvider,
} from "thirdweb/react";
import { THIRDWEB_CLIENT } from "@/lib/client";

const vitalikAddress = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

export function AccountNameBasicPreview() {
  return (
    <AccountProvider address={vitalikAddress} client={THIRDWEB_CLIENT}>
      <AccountName loadingComponent={<span>Loading...</span>} />
    </AccountProvider>
  );
}

export function AccountNameCustomPreview() {
  return (
    <AccountProvider address={vitalikAddress} client={THIRDWEB_CLIENT}>
      <AccountName
        loadingComponent={<span>Loading...</span>}
        socialType="lens"
      />
    </AccountProvider>
  );
}

export function AccountBalanceBasicPreview() {
  return (
    <AccountProvider address={vitalikAddress} client={THIRDWEB_CLIENT}>
      <AccountBalance
        chain={ethereum}
        loadingComponent={<span>Loading...</span>}
      />
    </AccountProvider>
  );
}

export function AccountBalanceCustomTokenPreview() {
  return (
    <AccountProvider address={vitalikAddress} client={THIRDWEB_CLIENT}>
      <AccountBalance
        chain={ethereum}
        loadingComponent={<span>Loading...</span>}
        tokenAddress="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      />
    </AccountProvider>
  );
}

export function AccountBalanceFormatPreview() {
  return (
    <AccountProvider address={vitalikAddress} client={THIRDWEB_CLIENT}>
      <AccountBalance
        chain={ethereum}
        formatFn={(props: AccountBalanceInfo) =>
          `${Math.ceil(props.balance * 1000) / 1000} ${props.symbol}`
        }
        loadingComponent={<span>Loading...</span>}
      />
    </AccountProvider>
  );
}

export function AccountBalanceUSDPreview() {
  return (
    <AccountProvider address={vitalikAddress} client={THIRDWEB_CLIENT}>
      <AccountBalance
        chain={ethereum}
        loadingComponent={<span>Loading...</span>}
        showBalanceInFiat="USD"
      />
    </AccountProvider>
  );
}

export function AccountAvatarBasicPreview() {
  return (
    <AccountProvider address={vitalikAddress} client={THIRDWEB_CLIENT}>
      <AccountAvatar
        className="h-20 w-20 rounded-full"
        loadingComponent={<span>Loading...</span>}
      />
    </AccountProvider>
  );
}

export function AccountBlobbieBasicPreview() {
  return (
    <AccountProvider address={vitalikAddress} client={THIRDWEB_CLIENT}>
      <AccountBlobbie className="h-20 w-20 rounded-full" />
    </AccountProvider>
  );
}
