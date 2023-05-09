import { CustomFormControl } from "../common";
import { useClaimConditionsFormContext } from "../index";
import { Input } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import React from "react";

/**
 * Display the creator address
 */

interface CreatorInputProps {
  creatorAddress: string;
}

export const CreatorInput: React.FC<CreatorInputProps> = ({
  creatorAddress,
}) => {
  const { formDisabled, claimConditionType, isAdmin } =
    useClaimConditionsFormContext();
  const walletAddress = useAddress();

  if (claimConditionType !== "creator") {
    return null;
  }

  return (
    <CustomFormControl
      disabled={formDisabled}
      label="Creator address"
      helperText={
        <>
          This wallet address will be able to indefinitely claim. {isAdmin && "To use a different address, please connect a different wallet."}
        </>
      }
    >
      <Input disabled readOnly value={creatorAddress || walletAddress} />
    </CustomFormControl>
  );
};
