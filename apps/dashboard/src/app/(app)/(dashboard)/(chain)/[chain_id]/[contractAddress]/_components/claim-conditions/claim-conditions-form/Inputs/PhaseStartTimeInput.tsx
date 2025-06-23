import { Input } from "@chakra-ui/react";
import { toDateTimeLocal } from "@/utils/date-utils";
import { CustomFormControl } from "../common";
import { useClaimConditionsFormContext } from "../index";

/**
 * Allows users to edit the start time for the claim phase.
 */
export const PhaseStartTimeInput: React.FC = () => {
  const { form, phaseIndex, field, formDisabled } =
    useClaimConditionsFormContext();
  return (
    <CustomFormControl
      disabled={formDisabled}
      error={
        form.getFieldState(`phases.${phaseIndex}.startTime`, form.formState)
          .error
      }
      helperText="This time is in your local timezone."
      label="When will this phase start?"
    >
      <Input
        onChange={(e) =>
          form.setValue(
            `phases.${phaseIndex}.startTime`,
            new Date(e.target.value),
          )
        }
        type="datetime-local"
        value={toDateTimeLocal(field.startTime)}
      />
    </CustomFormControl>
  );
};
