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
      label="Name"
      helperText="This does not affect how your claim phase functions and is for organizational purposes only."
    >
      <Input
        disabled={formDisabled}
        type="text"
        value={inputValue}
        placeholder={inputPlaceholder}
        onChange={(e) => {
          form.setValue(`phases.${phaseIndex}.metadata.name`, e.target.value);
        }}
      />
    </CustomFormControl>
  );
};
