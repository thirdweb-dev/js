import { Input } from "@/components/ui/input";
import { CustomFormControl } from "../common";
import { useClaimConditionsFormContext } from "../index";

/**
 * Allows users to edit the name for the claim phase.
 */
export const PhaseNameInput: React.FC = () => {
  const { phaseIndex, formDisabled, form, field } =
    useClaimConditionsFormContext();
  const inputPlaceholder = `Phase ${phaseIndex + 1}`;
  const inputValue = field.metadata?.name;

  return (
    <CustomFormControl
      disabled={formDisabled}
      helperText="This does not affect how your claim phase functions and is for organizational purposes only."
      label="Name"
    >
      <Input
        disabled={formDisabled}
        onChange={(e) => {
          form.setValue(`phases.${phaseIndex}.metadata.name`, e.target.value);
        }}
        placeholder={inputPlaceholder}
        type="text"
        value={inputValue}
      />
    </CustomFormControl>
  );
};
