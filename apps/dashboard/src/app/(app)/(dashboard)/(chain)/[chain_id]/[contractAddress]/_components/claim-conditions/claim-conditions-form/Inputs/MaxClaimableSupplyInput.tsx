import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { QuantityInputWithUnlimited } from "../../quantity-input-with-unlimited";
import { useClaimConditionsFormContext } from "..";

/**
 * Allows the user to select how many NFTs will be dropped in a phase
 */
export const MaxClaimableSupplyInput: React.FC = () => {
  const {
    isErc20,
    form,
    formDisabled,
    phaseIndex,
    tokenDecimals,
    field,
    claimConditionType,
  } = useClaimConditionsFormContext();

  if (claimConditionType === "creator") {
    return null;
  }

  return (
    <FormFieldSetup
      isRequired={true}
      errorMessage={
        form.getFieldState(
          `phases.${phaseIndex}.maxClaimableSupply`,
          form.formState,
        ).error?.message
      }
      label={`How many ${
        isErc20 ? "tokens" : "NFTs"
      } will you drop in this phase?`}
    >
      <QuantityInputWithUnlimited
        decimals={tokenDecimals}
        isDisabled={formDisabled || (isErc20 && !tokenDecimals)}
        isRequired
        onChange={(value) =>
          form.setValue(
            `phases.${phaseIndex}.maxClaimableSupply`,
            value.toString(),
          )
        }
        value={field.maxClaimableSupply?.toString() || "0"}
      />
    </FormFieldSetup>
  );
};
