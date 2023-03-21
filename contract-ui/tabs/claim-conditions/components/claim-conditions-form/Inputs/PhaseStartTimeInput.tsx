import { CustomFormControl } from "../common";
import { useClaimConditionsFormContext } from "../index";
import { Input } from "@chakra-ui/react";
import React from "react";
import { toDateTimeLocal } from "utils/date-utils";

/**
 * Allows users to edit the start time for the claim phase.
 */
export const PhaseStartTimeInput: React.FC = () => {
  const { form, phaseIndex, field, formDisabled } =
    useClaimConditionsFormContext();
  return (
    <CustomFormControl
      label="When will this phase start?"
      helperText="This time is in your local timezone."
      disabled={formDisabled}
      error={
        form.getFieldState(`phases.${phaseIndex}.startTime`, form.formState)
          .error
      }
    >
      <Input
        type="datetime-local"
        value={toDateTimeLocal(field.startTime)}
        onChange={(e) =>
          form.setValue(
            `phases.${phaseIndex}.startTime`,
            new Date(e.target.value),
          )
        }
      />
    </CustomFormControl>
  );
};
