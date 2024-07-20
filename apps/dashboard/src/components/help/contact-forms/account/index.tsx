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
    label: "Pricing inquiry",
    component: (
      <>
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
  {
    label: "Billing inquiry",
    component: (
      <>
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
  {
    label: "Usage inquiry",
    component: (
      <>
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
  {
    label: "Other",
    component: (
      <>
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
];

export default function AccountSupportForm() {
  const [problemArea, setProblemArea] = useState<string>("");

  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        name="extraInfo_Problem_Area"
        promptText="Select a problem area"
        options={ACCOUNT_PROBLEM_AREAS.map((o) => o.label)}
        required={true}
        value={problemArea}
        onValueChange={setProblemArea}
      />
      {ACCOUNT_PROBLEM_AREAS.find((o) => o.label === problemArea)?.component}
    </>
  );
}
