import { type ReactElement, useState } from "react";
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
  const [problemArea, setProblemArea] = useState<string>("");
  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        name="extraInfo_Problem_Area"
        promptText="Select a problem area"
        options={OTHER_PROBLEM_AREAS.map((o) => o.label)}
        required={true}
        value={problemArea}
        onValueChange={setProblemArea}
      />
      {OTHER_PROBLEM_AREAS.find((o) => o.label === problemArea)?.component}
    </>
  );
}
