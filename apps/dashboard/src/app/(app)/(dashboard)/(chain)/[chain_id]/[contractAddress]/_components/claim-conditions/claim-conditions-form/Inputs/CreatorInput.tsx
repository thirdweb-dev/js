import { useActiveAccount } from "thirdweb/react";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Input } from "@/components/ui/input";
import { useClaimConditionsFormContext } from "../index";

/**
 * Display the creator address
 */

interface CreatorInputProps {
  creatorAddress: string;
}

export const CreatorInput: React.FC<CreatorInputProps> = ({
  creatorAddress,
}) => {
  const { claimConditionType, isAdmin } = useClaimConditionsFormContext();
  const walletAddress = useActiveAccount()?.address;

  if (claimConditionType !== "creator") {
    return null;
  }

  return (
    <FormFieldSetup
      isRequired={false}
      errorMessage={undefined}
      helperText={
        <>
          This wallet address will be able to indefinitely claim.{" "}
          {isAdmin &&
            "To use a different address, please connect a different wallet."}
        </>
      }
      label="Creator address"
    >
      <Input
        disabled
        readOnly
        value={creatorAddress || walletAddress}
        className="disabled:opacity-100 max-w-sm"
      />
    </FormFieldSetup>
  );
};
