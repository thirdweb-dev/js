import { useState } from "react";
import { DescriptionInput } from "../../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../../shared/SupportForm_SelectInput";
import { SupportForm_TextInput } from "../../shared/SupportForm_TextInput";

const PAYMENT_AREAS = ["Dashboard", "Application"];

export function PaymentsSupportForm() {
  const [area, setArea] = useState<string>("");

  return (
    <>
      <SupportForm_SelectInput
        formLabel="Affected Area"
        name="extraInfo_Payments_Area"
        onValueChange={setArea}
        options={PAYMENT_AREAS}
        promptText="Select affected area"
        required={true}
        value={area}
      />
      {area === "Application" && (
        <>
          <SupportForm_TextInput
            formLabel="SDK"
            formValue="extraInfo_Payments_SDK"
            inputType="text"
            placeholder="e.g. React, Unity, iOS, etc."
            required={true}
          />
          <SupportForm_TextInput
            formLabel="SDK Version"
            formValue="extraInfo_Payments_SDK_Version"
            inputType="text"
            placeholder="e.g. 3.12.0"
            required={true}
          />
          <SupportForm_TextInput
            formLabel="Application URL"
            formValue="extraInfo_Payments_App_URL"
            inputType="url"
            placeholder="https://your-app-url.com"
            required={true}
          />
        </>
      )}
      {(area === "Application" || area === "Dashboard") && <DescriptionInput />}
    </>
  );
}
