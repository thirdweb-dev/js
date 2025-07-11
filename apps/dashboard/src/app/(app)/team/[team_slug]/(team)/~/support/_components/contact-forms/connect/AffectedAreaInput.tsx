import { useState } from "react";
import { DescriptionInput } from "../../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../../shared/SupportForm_SelectInput";
import { SupportForm_TextInput } from "../../shared/SupportForm_TextInput";
import { UnitySupportForm } from "../../shared/SupportForm_UnityInput";

const AFFECTED_AREAS = ["Dashboard", "Application"];

export const AffectedAreaInput = () => {
  const [selectedAffectedArea, setSelectedAffectedArea] = useState<string>("");
  const [selectedSDK, setSelectedSDK] = useState<string>("");
  return (
    <>
      <SupportForm_SelectInput
        formLabel="Affected area"
        name="extraInfo_Affected_Area"
        onValueChange={setSelectedAffectedArea}
        options={AFFECTED_AREAS}
        promptText="Select an affected area"
        required={true}
        value={selectedAffectedArea}
      />
      {selectedAffectedArea &&
        (selectedAffectedArea === "Application" ? (
          <>
            <SupportForm_SelectInput
              formLabel="SDK"
              name="extraInfo_SDK"
              onValueChange={setSelectedSDK}
              options={["TypeScript", "React", "React Native", "Unity"]}
              promptText="Select SDK"
              required={true}
              value={selectedSDK}
            />
            {selectedSDK && (
              <>
                {selectedSDK === "Unity" && <UnitySupportForm />}
                <SupportForm_TextInput
                  formLabel="SDK Version"
                  formValue="extraInfo_SDK_Version"
                  inputType="text"
                  required={true}
                />
                <SupportForm_TextInput
                  formLabel="Application URL"
                  formValue="extraInfo_Application_URL"
                  inputType="url"
                  required={false}
                />
                <DescriptionInput />
              </>
            )}
          </>
        ) : (
          <DescriptionInput />
        ))}
    </>
  );
};
