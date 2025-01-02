"use client";

import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import type { ThirdwebContract } from "thirdweb";
import { ClaimConditionsForm } from "./claim-conditions-form/index";

interface ClaimConditionsProps {
  contract: ThirdwebContract;
  tokenId?: string;
  isColumn?: true;
  isERC20: boolean;
  twAccount: Account | undefined;
}
export const ClaimConditions: React.FC<ClaimConditionsProps> = ({
  contract,
  tokenId,
  isColumn,
  isERC20,
  twAccount,
}) => {
  return (
    <div className="flex w-full flex-col gap-6">
      <section>
        <h2 className="mb-1 font-semibold text-xl tracking-tight">
          Set Claim Conditions
        </h2>
        <p className="text-muted-foreground text-sm">
          Control when the {isERC20 ? "tokens" : "NFTs"} get dropped, how much
          they cost, and more.
        </p>
      </section>

      {/* Set Claim Conditions */}
      <ClaimConditionsForm
        twAccount={twAccount}
        isErc20={isERC20}
        contract={contract}
        tokenId={tokenId}
        isColumn={isColumn}
        // always multi phase!
        isMultiPhase={true}
      />
    </div>
  );
};
