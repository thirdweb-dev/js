import type { CreateTicketInput } from "@3rdweb-sdk/react/hooks/useApi";
import type { ReactElement } from "react";
import { useWatch } from "react-hook-form";
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
  const problemArea: string =
    useWatch<CreateTicketInput>({
      name: "extraInfo_Problem_Area",
    }) || "";

  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        formValue="extraInfo_Problem_Area"
        promptText="Select a problem area"
        options={ACCOUNT_PROBLEM_AREAS.map((o) => o.label)}
        required={true}
      />
      {ACCOUNT_PROBLEM_AREAS.find((o) => o.label === problemArea)?.component}
    </>
  );
}
