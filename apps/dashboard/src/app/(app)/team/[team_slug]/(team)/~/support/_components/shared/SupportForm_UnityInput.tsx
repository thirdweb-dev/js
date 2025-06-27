import { useState } from "react";
import { SupportForm_SelectInput } from "./SupportForm_SelectInput";
import { SupportForm_TextInput } from "./SupportForm_TextInput";

const OPERATING_SYSTEMS = ["Windows", "MacOS", "Linux", "Other"];
const TARGET_PLATFORMS = [
  "Windows Standalone",
  "MacOS Standalone",
  "Linux Standalone",
  "WebGL",
  "Android",
  "iOS",
  "Other",
];

export const UnitySupportForm = () => {
  const [selectedOS, setSelectedOS] = useState<string>("");
  const [selectedTargetPlatform, setSelectedTargetPlatform] =
    useState<string>("");
  return (
    <>
      <SupportForm_SelectInput
        formLabel="OS"
        name="extraInfo_OS"
        onValueChange={setSelectedOS}
        options={OPERATING_SYSTEMS}
        promptText="Select an operating system"
        required={true}
        value={selectedOS}
      />
      <SupportForm_SelectInput
        formLabel="Target platform"
        name="extraInfo_Target_Platform"
        onValueChange={setSelectedTargetPlatform}
        options={TARGET_PLATFORMS}
        promptText="Select the target platform"
        required={true}
        value={selectedTargetPlatform}
      />
      <SupportForm_TextInput
        formLabel="Unity version"
        formValue="extraInfo_Unity_Version"
        inputType="text"
        required={true}
      />
    </>
  );
};
