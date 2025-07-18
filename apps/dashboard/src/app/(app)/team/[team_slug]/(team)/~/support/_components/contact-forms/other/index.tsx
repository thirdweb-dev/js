import { useState } from "react";
import { DescriptionInput } from "../../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../../shared/SupportForm_SelectInput";

const SharedOtherProblemComponent = () => {
  const [description, setDescription] = useState<string>("");

  return <DescriptionInput value={description} onChange={setDescription} />;
};

const OTHER_PROBLEM_AREAS = [
  "General inquiry",
  "Feature request",
  "Bug report",
  "Documentation",
  "Integration help",
  "Other",
];
export function OtherSupportForm() {
  const [problemArea, setProblemArea] = useState<string>("");

  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        name="extraInfo_Problem_Area"
        onValueChange={setProblemArea}
        options={OTHER_PROBLEM_AREAS}
        promptText="Select a problem area"
        required={true}
        value={problemArea}
      />
      {problemArea && <SharedOtherProblemComponent />}
    </>
  );
}
