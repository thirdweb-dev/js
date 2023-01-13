import { useClaimsConditionFormContext } from "..";
import { CustomFormControl } from "../common";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { CurrencySelector } from "components/shared/CurrencySelector";

/**
 * Allows the user to select which currency they want to use for claiming NFTs
 */
export const CurrencySelection = () => {
  const { formDisabled, form, phaseIndex, field } =
    useClaimsConditionFormContext();
  return (
    <CustomFormControl
      label="What currency do you want to use?"
      disabled={formDisabled}
      error={
        form.getFieldState(
          `phases.${phaseIndex}.currencyAddress`,
          form.formState,
        ).error
      }
    >
      <CurrencySelector
        isDisabled={formDisabled}
        value={field?.currencyAddress || NATIVE_TOKEN_ADDRESS}
        onChange={(e) =>
          form.setValue(`phases.${phaseIndex}.currencyAddress`, e.target.value)
        }
      />
    </CustomFormControl>
  );
};
