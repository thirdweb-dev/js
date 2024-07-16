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
        required={true}
        promptText="Select an operating system"
        options={OPERATING_SYSTEMS}
        value={selectedOS}
        onValueChange={setSelectedOS}
      />
      <SupportForm_SelectInput
        formLabel="Target platform"
        name="extraInfo_Target_Platform"
        required={true}
        promptText="Select the target platform"
        options={TARGET_PLATFORMS}
        value={selectedTargetPlatform}
        onValueChange={setSelectedTargetPlatform}
      />
      <SupportForm_TextInput
        formLabel="Unity version"
        formValue="extraInfo_Unity_Version"
        required={true}
        inputType="text"
      />
    </>
  );
};
