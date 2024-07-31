import { useState } from "react";
import { AttachmentForm } from "../shared/SupportForm_AttachmentUploader";
import { DescriptionInput } from "../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../shared/SupportForm_SelectInput";
import { SupportForm_TextInput } from "../shared/SupportForm_TextInput";
import { UnitySupportForm } from "../shared/SupportForm_UnityInput";

const AFFECTED_AREAS = ["Dashboard", "Application"];

export const AffectedAreaInput = () => {
  const [selectedAffectedArea, setSelectedAffectedArea] = useState<string>("");
  const [selectedSDK, setSelectedSDK] = useState<string>("");
  return (
    <>
      <SupportForm_SelectInput
        formLabel="Affected area"
        name="extraInfo_Affected_Area"
        required={true}
        options={AFFECTED_AREAS}
        promptText="Select an affected area"
        value={selectedAffectedArea}
        onValueChange={setSelectedAffectedArea}
      />
      {selectedAffectedArea && (
        <>
          {selectedAffectedArea === "Application" ? (
            <>
              <SupportForm_SelectInput
                formLabel="SDK"
                name="extraInfo_SDK"
                required={true}
                promptText="Select SDK"
                options={["TypeScript", "React", "React Native", "Unity"]}
                value={selectedSDK}
                onValueChange={setSelectedSDK}
              />
              {selectedSDK && (
                <>
                  {selectedSDK === "Unity" && <UnitySupportForm />}
                  <SupportForm_TextInput
                    formLabel="SDK Version"
                    formValue="extraInfo_SDK_Version"
                    required={true}
                    inputType="text"
                  />
                  <SupportForm_TextInput
                    formLabel="Application URL"
                    formValue="extraInfo_Application_URL"
                    required={false}
                    inputType="url"
                  />
                  <DescriptionInput />
                  <AttachmentForm />
                </>
              )}
            </>
          ) : (
            <>
              <DescriptionInput />
              <AttachmentForm />
            </>
          )}
        </>
      )}
    </>
  );
};
