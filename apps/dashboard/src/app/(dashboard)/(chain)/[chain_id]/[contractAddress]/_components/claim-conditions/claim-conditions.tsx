"use client";

import { Flex } from "@chakra-ui/react";
import type { ThirdwebContract } from "thirdweb";
import { ClaimConditionsForm } from "./claim-conditions-form/index";

interface ClaimConditionsProps {
  contract: ThirdwebContract;
  tokenId?: string;
  isColumn?: true;
  isERC20: boolean;
}
export const ClaimConditions: React.FC<ClaimConditionsProps> = ({
  contract,
  tokenId,
  isColumn,
  isERC20,
}) => {
  return (
    <div className="flex w-full flex-col gap-8">
      <Flex p={0} position="relative">
        <Flex
          pt={{ base: isColumn ? 0 : 6, md: 6 }}
          direction="column"
          gap={8}
          w="full"
        >
          {/* Info */}
          <section>
            <h2 className="mb-1 font-semibold text-xl tracking-tight">
              Set Claim Conditions
            </h2>
            <p className="text-muted-foreground text-sm">
              Control when the {isERC20 ? "tokens" : "NFTs"} get dropped, how
              much they cost, and more.
            </p>
          </section>

          {/* Set Claim Conditions */}
          <ClaimConditionsForm
            isErc20={isERC20}
            contract={contract}
            tokenId={tokenId}
            isColumn={isColumn}
            // always multi phase!
            isMultiPhase={true}
          />
        </Flex>
      </Flex>
    </div>
  );
};
