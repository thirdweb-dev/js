import { useState } from "react";
import type { Chain } from "../../../../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../../../../client/client.js";
import { NATIVE_TOKEN_ADDRESS } from "../../../../../../../constants/addresses.js";
import { getContract } from "../../../../../../../contract/contract.js";
import { approve } from "../../../../../../../extensions/erc20/write/approve.js";
import { addSessionKey } from "../../../../../../../extensions/erc4337/account/addSessionKey.js";
import { getPayBaseUrl } from "../../../../../../../pay/utils/definitions.js";
import { createAndSignUserOp } from "../../../../../../../wallets/smart/lib/userop.js";
import { hexlifyUserOp } from "../../../../../../../wallets/smart/lib/utils.js";
import { smartWallet } from "../../../../../../../wallets/smart/smart-wallet.js";
import { useActiveAccount } from "../../../../../../core/hooks/wallets/useActiveAccount.js";
import { useSwitchActiveWalletChain } from "../../../../../../core/hooks/wallets/useSwitchActiveWalletChain.js";

export function useDeploySmartWallet(client: ThirdwebClient) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const account = useActiveAccount();
  const switchChain = useSwitchActiveWalletChain();

  const deploySmartWallet = async ({
    chain,
    intentId,
    onRampTokenMeta,
    onRampTokenAmount,
    setOnRampLinkOverride,
  }: {
    chain: Chain;
    intentId: string;
    onRampTokenMeta: {
      tokenAddress: string;
    };
    onRampTokenAmount: string;
    setOnRampLinkOverride?: (link: string) => void;
  }) => {
    if (!account) {
      throw new Error("No active account");
    }

    setIsLoading(true);
    setError(null);

    try {
      await switchChain(chain);

      const smartWalletHandle = smartWallet({
        chain,
        sponsorGas: true,
      });

      const smartAccount = await smartWalletHandle.connect({
        client,
        personalAccount: account,
      });

      const smartAccountContract = getContract({
        client,
        chain,
        address: smartAccount.address,
      });

      const transactionsToSign = [];

      const sessionKeyTx = addSessionKey({
        contract: smartAccountContract,
        account: account,
        // TODO: Env var this.
        sessionKeyAddress: "0x32DC86f866e9F5Ed59A60b18c3B0f9b972a928F0", // dev engine backend wallet
        permissions: {
          approvedTargets: "*",
          permissionStartTimestamp: new Date(),
          permissionEndTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000),
          nativeTokenLimitPerTransaction: onRampTokenAmount,
        },
      });
      transactionsToSign.push(sessionKeyTx);

      if (onRampTokenMeta.tokenAddress !== NATIVE_TOKEN_ADDRESS) {
        console.log("adding approveTx");
        const approveTx = approve({
          contract: getContract({
            client,
            chain,
            address: onRampTokenMeta.tokenAddress,
          }),
          spender: smartAccount.address,
          amount: onRampTokenAmount,
        });
        transactionsToSign.push(approveTx);
      }

      console.log("transactionsToSign is ", transactionsToSign);
      const signedUserOp = await createAndSignUserOp({
        transactions: transactionsToSign,
        adminAccount: account,
        client,
        smartWalletOptions: {
          chain,
          sponsorGas: true,
        },
      });

      const hexlifiedUserOp = hexlifyUserOp(signedUserOp);

      const response = await fetch(
        `${getPayBaseUrl()}/v2/intent-wallets/deploy`,
        {
          method: "POST",
          body: JSON.stringify({
            chainId: chain.id,
            intentId,
            intentType: "buyWithFiat",
            signedUserOp: hexlifiedUserOp,
            toAddress: account.address,
            smartWalletAddress: smartAccount.address,
            // TODO: Update this to use additional actions in the future.
            action: "TRANSFER",
          }),
          headers: {
            "Content-Type": "application/json",
            "x-client-id": process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
          },
        },
      );

      const data = await response.json();
      setOnRampLinkOverride?.(data.onRampLink);

      return {
        smartWalletAddress: smartAccount.address,
        userAddress: account.address,
        onRampLink: data.onRampLink,
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An error occurred"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deploySmartWallet, isLoading, error };
}
