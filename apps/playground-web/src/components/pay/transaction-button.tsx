"use client";

import { useTheme } from "next-themes";
import { getContract } from "thirdweb";
import { polygon } from "thirdweb/chains";
import { claimTo } from "thirdweb/extensions/erc1155";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { CodeExample } from "../code/code-example";
import { StyledConnectButton } from "../styled-connect-button";

export function PayTransactionButton() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Transaction Button
        </h2>
        <p className="max-w-[600px]">
          Transaction Button is a handy component that handles transactions.
          <br />
          If your user doesn&apos;t have enough funds for that transaction, a
          pre-filled pay modal will appear with the exact amount needed.
        </p>
      </div>

      <CodeExample
        preview={<PayTransactionButtonPreview />}
        code={`import { claimTo } from "thirdweb/extensions/erc1155";
        import { TransactionButton, useActiveAccount } from "thirdweb/react";


        function App() {
          const account = useActiveAccount();
        
          return (
            <TransactionButton
              transaction={() => {
                // any transaction works
                return claimTo({
                  contract,
                  quantity: 1n,
                  tokenId: 0n,
                  to: account.address,
                });
              }}
            >
              Buy for 10 MATIC
            </TransactionButton>
          );
        };`}
        lang="tsx"
      />
    </>
  );
}

const contract = getContract({
  address: "0x96B30d36f783c7BC68535De23147e2ce65788e93",
  chain: polygon,
  client: THIRDWEB_CLIENT,
});

function PayTransactionButtonPreview() {
  const account = useActiveAccount();
  const { theme } = useTheme();

  return account ? (
    <TransactionButton
      transaction={() => {
        if (!account) throw new Error("No active account");
        return claimTo({
          contract,
          quantity: 1n,
          tokenId: 0n,
          to: account?.address,
        });
      }}
      payModal={{
        theme: theme === "light" ? "light" : "dark",
      }}
    >
      Buy for 10 MATIC
    </TransactionButton>
  ) : (
    <StyledConnectButton />
  );
}
