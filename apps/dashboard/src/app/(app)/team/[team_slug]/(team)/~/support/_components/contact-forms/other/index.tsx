import { type ReactElement, useState } from "react";
import { DescriptionInput } from "../../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../../shared/SupportForm_SelectInput";

const SharedOtherProblemComponent = (
  <>
    <DescriptionInput />
  </>
);

type ProblemAreaItem = {
  label: string;
  component: ReactElement;
};

const OTHER_PROBLEM_AREAS: ProblemAreaItem[] = [
  {
    component: SharedOtherProblemComponent,
    label: "General inquiry",
  },
  {
    component: SharedOtherProblemComponent,
    label: "Security",
  },
  {
    component: SharedOtherProblemComponent,
    label: "Feedback",
  },
  {
    component: SharedOtherProblemComponent,
    label: "Other",
  },
];

function OtherSupportForm() {
  const [problemArea, setProblemArea] = useState<string>("");
  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        name="extraInfo_Problem_Area"
        onValueChange={setProblemArea}
        options={OTHER_PROBLEM_AREAS.map((o) => o.label)}
        promptText="Select a problem area"
        required={true}
        value={problemArea}
      />
      {OTHER_PROBLEM_AREAS.find((o) => o.label === problemArea)?.component}
    </>
  );
}

export { OtherSupportForm };
