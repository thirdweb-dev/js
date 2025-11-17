import { useState } from "react";
import { DescriptionInput } from "../../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../../shared/SupportForm_SelectInput";
import { SupportForm_TextInput } from "../../shared/SupportForm_TextInput";
import { UnitySupportForm } from "../../shared/SupportForm_UnityInput";

const API_SDK_OPTIONS = [
  "API endpoint",
  "React/TypeScript",
  "Unity/.NET",
  "React Native",
];

export function EngineSupportForm() {
  const [selectedSDK, setSelectedSDK] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  return (
    <>
      <SupportForm_SelectInput
        formLabel="Which API/SDK are you using?"
        name="extraInfo_API_SDK"
        onValueChange={setSelectedSDK}
        options={API_SDK_OPTIONS}
        promptText="Select a problem area"
        required={true}
        value={selectedSDK}
      />
      {selectedSDK && (
        <>
          {selectedSDK === "Unity/.NET" ? (
            <UnitySupportForm />
          ) : (
            selectedSDK !== "API endpoint" && (
              <SupportForm_TextInput
                formLabel="Version of SDK"
                formValue="extraInfo_SDK_Version"
                inputType="text"
                placeholder="e.g. 3.12.0"
                required={true}
              />
            )
          )}
          <SupportForm_TextInput
            formLabel="Queue/Support ID in logs"
            formValue="extraInfo_Queue_Support_ID"
            inputType="text"
            placeholder="Enter support ID from logs"
            required={false}
          />
          {selectedSDK === "API endpoint" && (
            <SupportForm_TextInput
              formLabel="API endpoint URL with parameters"
              formValue="extraInfo_API_Endpoint_URL"
              inputType="url"
              placeholder="https://api.example.com/endpoint?param=value"
              required={false}
            />
          )}
          <DescriptionInput value={description} onChange={setDescription} />
        </>
      )}
    </>
  );
}
