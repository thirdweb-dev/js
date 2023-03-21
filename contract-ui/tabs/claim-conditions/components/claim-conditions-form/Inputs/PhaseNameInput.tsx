import { CustomFormControl } from "../common";
import { useClaimConditionsFormContext } from "../index";
import { Input } from "@chakra-ui/react";
import React from "react";
import { Heading } from "tw-components";

/**
 * Allows users to edit the name for the claim phase.
 */
export const PhaseNameInput: React.FC = () => {
  const { phaseIndex, formDisabled, isClaimPhaseV1, form, field } =
    useClaimConditionsFormContext();
  const inputPlaceholder = `Phase ${phaseIndex + 1}`;
  const inputValue = field.metadata?.name;

  if (isClaimPhaseV1) {
    return <Heading size="label.lg">{inputValue || inputPlaceholder}</Heading>;
  }

  return (
    <CustomFormControl
      disabled={formDisabled}
      label="Name"
      helperText="This does not affect how your claim phase functions and is for organizational purposes only."
    >
      <Input
        isDisabled={formDisabled}
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
