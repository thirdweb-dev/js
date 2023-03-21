import { CustomFormControl } from "../common";
import { useClaimConditionsFormContext } from "../index";
import { BigNumberInput } from "components/shared/BigNumberInput";
import React from "react";

/**
 * Allows users to edit the waiting time between claim phases.
 */
export const WaitingTimeInput: React.FC = () => {
  const { formDisabled, form, phaseIndex, field } =
    useClaimConditionsFormContext();

  return (
    <CustomFormControl
      disabled={formDisabled}
      label="How many seconds do wallets have to wait in-between claiming?"
      error={
        form.getFieldState(`phases.${phaseIndex}.waitInSeconds`, form.formState)
          .error
      }
      helperText='Set this to "Unlimited" to only allow one claim transaction per wallet.'
    >
      <BigNumberInput
        isRequired
        isDisabled={formDisabled}
        value={field.waitInSeconds?.toString() || "0"}
        onChange={(value) =>
          form.setValue(`phases.${phaseIndex}.waitInSeconds`, value.toString())
        }
      />
    </CustomFormControl>
  );
};
