"use client";

import type { ThirdwebContract } from "thirdweb";
import { ClaimConditionsForm } from "./claim-conditions-form/index";

interface ClaimConditionsProps {
  contract: ThirdwebContract;
  tokenId?: string;
  isColumn?: true;
  isERC20: boolean;
  isLoggedIn: boolean;
  isMultiphase: boolean;
}
export const ClaimConditions: React.FC<ClaimConditionsProps> = ({
  contract,
  tokenId,
  isColumn,
  isERC20,
  isLoggedIn,
  isMultiphase,
}) => {
  return (
    <div className="space-y-5">
      <section>
        <h2 className="mb-0.5 font-semibold text-2xl tracking-tight">
          Set Claim Conditions
        </h2>
        <p className="text-muted-foreground text-sm">
          Control when the {isERC20 ? "tokens" : "NFTs"} get dropped, how much
          they cost, and more
        </p>
      </section>

      {/* Set Claim Conditions */}
      <ClaimConditionsForm
        contract={contract}
        isColumn={isColumn}
        isErc20={isERC20}
        isLoggedIn={isLoggedIn}
        isMultiPhase={isMultiphase}
        tokenId={tokenId}
      />
    </div>
  );
};
