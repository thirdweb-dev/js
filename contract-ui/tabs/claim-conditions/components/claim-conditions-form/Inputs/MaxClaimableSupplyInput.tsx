import { useClaimConditionsFormContext } from "..";
import { QuantityInputWithUnlimited } from "../../quantity-input-with-unlimited";
import { CustomFormControl } from "../common";

/**
 * Allows the user to select how many NFTs will be dropped in a phase
 */
export const MaxClaimableSupplyInput: React.FC = () => {
  const { isErc20, form, formDisabled, phaseIndex, tokenDecimals, field } =
    useClaimConditionsFormContext();
  return (
    <CustomFormControl
      label={`How many ${
        isErc20 ? "tokens" : "NFTs"
      } will you drop in this phase?`}
      error={
        form.getFieldState(
          `phases.${phaseIndex}.maxClaimableSupply`,
          form.formState,
        ).error
      }
      disabled={formDisabled}
    >
      <QuantityInputWithUnlimited
        isRequired
        isDisabled={formDisabled}
        decimals={tokenDecimals}
        value={field.maxClaimableSupply?.toString() || "0"}
        onChange={(value) =>
          form.setValue(
            `phases.${phaseIndex}.maxClaimableSupply`,
            value.toString(),
          )
        }
      />
    </CustomFormControl>
  );
};
