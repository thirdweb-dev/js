import { useState } from "react";
import { DescriptionInput } from "../../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../../shared/SupportForm_SelectInput";
import { SupportForm_TextInput } from "../../shared/SupportForm_TextInput";

const ENGINE_TYPES = ["Cloud (V3)", "Dedicated (V2)"];
const ENGINE_PROBLEM_AREAS = [
  "SSL Issues",
  "Transaction queueing issues",
  "401 - Unauthorized",
  "404 - Endpoint Not Found",
  "Other",
];

export function EngineSupportForm() {
  const [selectedEngineType, setSelectedEngineType] = useState<string>("");
  const [problemArea, setProblemArea] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  return (
    <>
      <SupportForm_SelectInput
        formLabel="Type"
        name="extraInfo_Engine_Type"
        onValueChange={setSelectedEngineType}
        options={ENGINE_TYPES}
        promptText="Select Engine type"
        required={true}
        value={selectedEngineType}
      />{" "}
      {selectedEngineType && (
        <>
          <SupportForm_SelectInput
            formLabel="Problem area"
            name="extraInfo_Problem_Area"
            onValueChange={setProblemArea}
            options={ENGINE_PROBLEM_AREAS}
            promptText="Select a problem area"
            required={true}
            value={problemArea}
          />

          {problemArea && (
            <>
              <SupportForm_TextInput
                formLabel="Engine URL"
                formValue="extraInfo_Engine_URL"
                inputType="url"
                placeholder="https://your-engine-url.com"
                required={true}
              />
              <DescriptionInput value={description} onChange={setDescription} />
            </>
          )}
        </>
      )}
    </>
  );
}
