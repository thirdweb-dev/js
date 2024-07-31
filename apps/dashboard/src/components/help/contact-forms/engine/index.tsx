import { useState } from "react";
import { AttachmentForm } from "../shared/SupportForm_AttachmentUploader";
import { DescriptionInput } from "../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../shared/SupportForm_SelectInput";
import { SupportForm_TextInput } from "../shared/SupportForm_TextInput";

const ENGINE_TYPES = ["Cloud-Hosted", "Self-Hosted"];
const ENGINE_PROBLEM_AREAS = [
  "SSL Issues",
  "Transaction queueing issues",
  "401 - Unauthorized",
  "404 - Endpoint Not Found",
  "Other",
];

export default function EngineSupportForm() {
  const [selectedEngineType, setSelectedEngineType] = useState<string>("");
  const [problemArea, setProblemArea] = useState<string>("");
  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        name="extraInfo_Engine_Type"
        promptText="Select Engine type"
        options={ENGINE_TYPES}
        value={selectedEngineType}
        onValueChange={setSelectedEngineType}
        required={true}
      />
      {selectedEngineType && (
        <>
          <SupportForm_SelectInput
            formLabel="Problem area"
            name="extraInfo_Problem_Area"
            promptText="Select a problem area"
            options={ENGINE_PROBLEM_AREAS}
            required={true}
            value={problemArea}
            onValueChange={setProblemArea}
          />

          {problemArea && (
            <>
              <SupportForm_TextInput
                formLabel="Engine URL"
                formValue="extraInfo_Engine_URL"
                required={true}
                inputType="url"
                placeholder="https://your-engine-url.com"
              />
              <DescriptionInput />
              <AttachmentForm />
            </>
          )}
        </>
      )}
    </>
  );
}
