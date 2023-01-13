import { useClaimsConditionFormContext } from "..";
import { PriceInput } from "../../price-input";
import { CustomFormControl } from "../common";

/**
 * Allows the user to select how much they want to charge to claim each NFT
 */
export const ClaimPriceInput = () => {
  const { formDisabled, isErc20, form, phaseIndex, field } =
    useClaimsConditionFormContext();

  return (
    <CustomFormControl
      disabled={formDisabled}
      label={`How much do you want to charge to claim each ${
        isErc20 ? "token" : "NFT"
      }?`}
      error={
        form.getFieldState(`phases.${phaseIndex}.price`, form.formState).error
      }
    >
      <PriceInput
        value={parseFloat(field.price?.toString() || "0")}
        onChange={(val) => form.setValue(`phases.${phaseIndex}.price`, val)}
      />
    </CustomFormControl>
  );
};
