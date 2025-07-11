import { type ReactElement, useState } from "react";
import { DescriptionInput } from "../../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../../shared/SupportForm_SelectInput";
import { SupportForm_TextInput } from "../../shared/SupportForm_TextInput";
import { UnitySupportForm } from "../../shared/SupportForm_UnityInput";
import { AffectedAreaInput } from "./AffectedAreaInput";

type ProblemAreaItem = {
  label: string;
  component: ReactElement;
};

const SDKVersionInput = () => (
  <SupportForm_TextInput
    formLabel="SDK Version"
    formValue="extraInfo_SDK_Version"
    inputType="text"
    required={true}
  />
);

const OSSelect = () => {
  const [selectedOS, setSelectedOS] = useState<string>("");
  return (
    <SupportForm_SelectInput
      formLabel="OS"
      name="extraInfo_OS"
      onValueChange={setSelectedOS}
      options={["Windows", "MacOS", "Linux", "Other"]}
      promptText="Select an operating system"
      required={true}
      value={selectedOS}
    />
  );
};

const PROBLEM_AREAS: ProblemAreaItem[] = [
  {
    component: <AffectedAreaInput />,
    label: "Embedded wallet login issues",
  },
  {
    component: <AffectedAreaInput />,
    label: "Embedded wallet transaction issues",
  },
  {
    component: <AffectedAreaInput />,
    label: "Embedded wallet Custom Auth",
  },
  {
    component: <AffectedAreaInput />,
    label: "Account Abstraction",
  },
  {
    component: <AffectedAreaInput />,
    label: "In-app wallet",
  },
  {
    component: (
      <>
        <SDKVersionInput />
        <SupportForm_TextInput
          formLabel="Application URL"
          formValue="extraInfo_Application_URL"
          inputType="url"
          required={false}
        />
        <DescriptionInput />
      </>
    ),
    label: "Connect SDKs",
  },
  {
    component: (
      <>
        <UnitySupportForm />
        <SDKVersionInput />
        <DescriptionInput />
      </>
    ),
    label: "Unity SDK",
  },
  {
    component: (
      <>
        <SDKVersionInput />
        <OSSelect />
        <SupportForm_TextInput
          formLabel="Framework"
          formValue="extraInfo_dotNET_Framework"
          inputType="text"
          placeholder="MAUI | Blazor | Godot, etc"
          required={false}
        />
        <SupportForm_TextInput
          formLabel="Target OS"
          formValue="extraInfo_dotNET_Target_OS"
          inputType="text"
          required={false}
        />
        <DescriptionInput />
      </>
    ),
    label: ".NET SDK",
  },
  {
    component: <AffectedAreaInput />,
    label: "Pay",
  },
  {
    component: <AffectedAreaInput />,
    label: "Auth",
  },
];

export function ConnectSupportForm() {
  const [selectedProblemArea, setSelectedProblemArea] = useState("");

  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        name="extraInfo_Problem_Area"
        onValueChange={setSelectedProblemArea}
        options={PROBLEM_AREAS.map((o) => o.label)}
        promptText="Select a problem area"
        required={true}
        value={selectedProblemArea}
      />
      {PROBLEM_AREAS.find((o) => o.label === selectedProblemArea)?.component}
    </>
  );
}
