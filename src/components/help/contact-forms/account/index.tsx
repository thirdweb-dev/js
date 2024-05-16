import { ReactElement } from "react";
import { DescriptionInput } from "../shared/SupportForm_DescriptionInput";
import { CreateTicketInput } from "@3rdweb-sdk/react/hooks/useApi";
import { useWatch } from "react-hook-form";
import { SupportForm_SelectInput } from "../shared/SupportForm_SelectInput";
import { AttachmentForm } from "../shared/SupportForm_AttachmentUploader";

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
  const SubFormComponent = () => {
    return (
      ACCOUNT_PROBLEM_AREAS.find((o) => o.label === problemArea)?.component || (
        <></>
      )
    );
  };
  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        formValue="extraInfo_Problem_Area"
        promptText="Select a problem area"
        options={ACCOUNT_PROBLEM_AREAS.map((o) => o.label)}
        required={true}
      />
      <SubFormComponent />
    </>
  );
}
