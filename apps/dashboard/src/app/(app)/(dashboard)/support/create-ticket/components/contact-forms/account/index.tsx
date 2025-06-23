import { type ReactElement, useState } from "react";
import { AttachmentForm } from "../shared/SupportForm_AttachmentUploader";
import { DescriptionInput } from "../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../shared/SupportForm_SelectInput";

type ProblemAreaItem = {
  label: string;
  component: ReactElement;
};

const ACCOUNT_PROBLEM_AREAS: ProblemAreaItem[] = [
  {
    component: (
      <>
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
    label: "Pricing inquiry",
  },
  {
    component: (
      <>
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
    label: "Billing inquiry",
  },
  {
    component: (
      <>
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
    label: "Usage inquiry",
  },
  {
    component: (
      <>
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
    label: "Other",
  },
];

export default function AccountSupportForm() {
  const [problemArea, setProblemArea] = useState<string>("");

  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        name="extraInfo_Problem_Area"
        onValueChange={setProblemArea}
        options={ACCOUNT_PROBLEM_AREAS.map((o) => o.label)}
        promptText="Select a problem area"
        required={true}
        value={problemArea}
      />
      {ACCOUNT_PROBLEM_AREAS.find((o) => o.label === problemArea)?.component}
    </>
  );
}
