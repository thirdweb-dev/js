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

const OTHER_PROBLEM_AREAS: ProblemAreaItem[] = [
  {
    label: "General inquiry",
    component: (
      <>
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
  {
    label: "Security",
    component: (
      <>
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
  {
    label: "Feedback",
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

export default function OtherSupportForm() {
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
        options={OTHER_PROBLEM_AREAS.map((o) => o.label)}
        required={true}
      />
      {OTHER_PROBLEM_AREAS.find((o) => o.label === problemArea)?.component}
    </>
  );
}
