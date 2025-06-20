"use client";

import { useTheme } from "next-themes";
import { getContract, prepareTransaction } from "thirdweb";
import { base, baseSepolia, polygon } from "thirdweb/chains";
import { transfer } from "thirdweb/extensions/erc20";
import { claimTo, getNFT } from "thirdweb/extensions/erc1155";
import {
  getDefaultToken,
  TransactionButton,
  TransactionWidget,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { toWei } from "thirdweb/utils";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { StyledConnectButton } from "../styled-connect-button";

const nftContract = getContract({
  address: "0xf0d0CBf84005Dd4eC81364D1f5D7d896Bd53D1B8",
  chain: base,
  client: THIRDWEB_CLIENT,
});

const USDC = getDefaultToken(polygon, "USDC");

const usdcContract = getContract({
  // biome-ignore lint/style/noNonNullAssertion: its there
  address: USDC!.address,
  chain: polygon,
  client: THIRDWEB_CLIENT,
});

export function PayTransactionPreview() {
  const account = useActiveAccount();
  const { theme } = useTheme();
  const { data: nft } = useReadContract(getNFT, {
    contract: nftContract,
    tokenId: 2n,
  });

  return (
    <TransactionWidget
      amount={"0.1"}
      client={THIRDWEB_CLIENT}
      description={nft?.metadata?.description}
      image={nft?.metadata?.image}
      theme={theme === "light" ? "light" : "dark"}
      title={nft?.metadata?.name}
      transaction={claimTo({
        contract: nftContract,
        quantity: 1n,
        to: account?.address || "",
        tokenId: 2n,
      })}
    />
  );
}

export function PayTransactionButtonPreview() {
  const account = useActiveAccount();
  const { theme } = useTheme();

  return (
    <>
      <StyledConnectButton />
      <div className="h-10" />
      {account && (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            Price:{" "}
            {USDC?.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={USDC.name} src={USDC.icon} width={16} />
            )}
            50 {USDC?.symbol}
          </div>
          <TransactionButton
            onError={(e) => {
              console.error(e);
            }}
            payModal={{
              theme: theme === "light" ? "light" : "dark",
            }}
            transaction={() => {
              if (!account) throw new Error("No active account");
              return transfer({
                amount: "50",
                contract: usdcContract,
                to: account?.address || "",
              });
            }}
          >
            Buy VIP Pass
          </TransactionButton>
          <div className="h-10" />
          <div className="flex items-center gap-2">Price: 0.1 ETH</div>
          <TransactionButton
            onError={(e) => {
              console.error(e);
            }}
            payModal={{
              theme: theme === "light" ? "light" : "dark",
            }}
            transaction={() => {
              if (!account) throw new Error("No active account");
              return prepareTransaction({
                chain: baseSepolia,
                client: THIRDWEB_CLIENT,
                to: account.address,
                value: toWei("0.1"),
              });
            }}
          >
            Send 0.1 ETH
          </TransactionButton>
        </div>
      )}
    </>
  );
}
