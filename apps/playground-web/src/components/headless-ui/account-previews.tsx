"use client";

import { THIRDWEB_CLIENT } from "@/lib/client";
import { ethereum } from "thirdweb/chains";
import {
  AccountAddress,
  AccountAvatar,
  AccountBalance,
  type AccountBalanceInfo,
  AccountBlobbie,
  AccountName,
  AccountProvider,
} from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

const vitalikAddress = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";

export function AccountAddressBasicPreview() {
  return (
    <AccountProvider address={vitalikAddress} client={THIRDWEB_CLIENT}>
      <AccountAddress />
    </AccountProvider>
  );
}

export function AccountAddressFormatPreview() {
  return (
    <AccountProvider address={vitalikAddress} client={THIRDWEB_CLIENT}>
      <AccountAddress formatFn={shortenAddress} />
    </AccountProvider>
  );
}

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
        socialType="lens"
        loadingComponent={<span>Loading...</span>}
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
        tokenAddress="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
        loadingComponent={<span>Loading...</span>}
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
        showBalanceInFiat="USD"
        loadingComponent={<span>Loading...</span>}
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

export function ConnectDetailsButtonClonePreview() {
  return (
    <AccountProvider address={vitalikAddress} client={THIRDWEB_CLIENT}>
      <button
        type="button"
        className="flex min-w-[200px] flex-row items-center gap-2 rounded-md border bg-zinc-900 px-4 py-2"
      >
        <AccountAvatar
          className="h-10 w-10 rounded-full"
          loadingComponent={
            <AccountBlobbie className="h-10 w-10 rounded-full" />
          }
          fallbackComponent={
            <AccountBlobbie className="h-10 w-10 rounded-full" />
          }
        />
        <div className="flex flex-col gap-1">
          <AccountName
            className="text-left"
            loadingComponent={
              <AccountAddress formatFn={shortenAddress} className="text-left" />
            }
            fallbackComponent={
              <AccountAddress formatFn={shortenAddress} className="text-left" />
            }
          />
          <div className="flex flex-row items-center gap-2">
            <AccountBalance
              className="text-left text-sm"
              chain={ethereum}
              loadingComponent={
                <span className="text-left text-sm">Loading...</span>
              }
              fallbackComponent={
                <span className="text-left text-sm">Loading...</span>
              }
            />
            <AccountBalance
              className="text-left text-sm"
              chain={ethereum}
              showBalanceInFiat="USD"
            />
          </div>
        </div>
      </button>
    </AccountProvider>
  );
}
