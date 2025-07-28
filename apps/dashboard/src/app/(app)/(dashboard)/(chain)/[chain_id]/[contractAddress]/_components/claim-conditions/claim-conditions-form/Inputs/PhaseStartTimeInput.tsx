import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { Input } from "@/components/ui/input";
import { toDateTimeLocal } from "@/utils/date-utils";
import { useClaimConditionsFormContext } from "../index";

/**
 * Allows users to edit the start time for the claim phase.
 */
export const PhaseStartTimeInput: React.FC = () => {
  const { form, phaseIndex, field, formDisabled } =
    useClaimConditionsFormContext();
  return (
    <FormFieldSetup
      isRequired={true}
      errorMessage={
        form.getFieldState(`phases.${phaseIndex}.startTime`, form.formState)
          .error?.message
      }
      helperText="This time is in your local timezone."
      label="When will this phase start?"
    >
      <Input
        disabled={formDisabled}
        className="max-w-sm"
        onChange={(e) =>
          form.setValue(
            `phases.${phaseIndex}.startTime`,
            new Date(e.target.value),
          )
        }
        type="datetime-local"
        value={toDateTimeLocal(field.startTime)}
      />
    </FormFieldSetup>
  );
};
