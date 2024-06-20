import type { CreateTicketInput } from "@3rdweb-sdk/react/hooks/useApi";
import { useWatch } from "react-hook-form";
import { AttachmentForm } from "../shared/SupportForm_AttachmentUploader";
import { DescriptionInput } from "../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../shared/SupportForm_SelectInput";
import { SupportForm_TextInput } from "../shared/SupportForm_TextInput";
import { UnitySupportForm } from "../shared/SupportForm_UnityInput";

const AFFECTED_AREAS = ["Dashboard", "Application"];

export const AffectedAreaInput = () => {
  const selectedAffectedArea = useWatch<CreateTicketInput>({
    name: "extraInfo_Affected_Area",
  });
  const selectedSDK = useWatch<CreateTicketInput>({
    name: "extraInfo_SDK",
  });
  return (
    <>
      <SupportForm_SelectInput
        formLabel="Affected area"
        formValue="extraInfo_Affected_Area"
        required={true}
        options={AFFECTED_AREAS}
        promptText="Select an affected area"
      />
      {selectedAffectedArea && (
        <>
          {selectedAffectedArea === "Application" ? (
            <>
              <SupportForm_SelectInput
                formLabel="SDK"
                formValue="extraInfo_SDK"
                required={true}
                promptText="Select SDK"
                options={["TypeScript", "React", "React Native", "Unity"]}
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
