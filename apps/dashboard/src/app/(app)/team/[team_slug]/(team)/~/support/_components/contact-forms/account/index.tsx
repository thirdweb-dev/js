"use client";

import { useState } from "react";
import { DescriptionInput } from "../../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../../shared/SupportForm_SelectInput";

const ACCOUNT_PROBLEM_AREAS = [
  "Pricing inquiry",
  "Billing inquiry",
  "Usage inquiry",
  "Other",
];

export function AccountSupportForm() {
  const [problemArea, setProblemArea] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        name="extraInfo_Problem_Area"
        onValueChange={setProblemArea}
        options={ACCOUNT_PROBLEM_AREAS}
        promptText="Select a problem area"
        required={true}
        value={problemArea}
      />
      {problemArea && (
        <DescriptionInput value={description} onChange={setDescription} />
      )}
    </>
  );
}
