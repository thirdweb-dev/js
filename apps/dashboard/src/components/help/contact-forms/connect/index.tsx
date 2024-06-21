import type { CreateTicketInput } from "@3rdweb-sdk/react/hooks/useApi";
import type { ReactElement } from "react";
import { useWatch } from "react-hook-form";
import { AttachmentForm } from "../shared/SupportForm_AttachmentUploader";
import { DescriptionInput } from "../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../shared/SupportForm_SelectInput";
import { SupportForm_TextInput } from "../shared/SupportForm_TextInput";
import { UnitySupportForm } from "../shared/SupportForm_UnityInput";
import { AffectedAreaInput } from "./AffectedAreaInput";

type ProblemAreaItem = {
  label: string;
  component: ReactElement;
};

const SDKVersionInput = () => (
  <SupportForm_TextInput
    formLabel="SDK Version"
    formValue="extraInfo_SDK_Version"
    required={true}
    inputType="text"
  />
);

const PROBLEM_AREAS: ProblemAreaItem[] = [
  {
    label: "Embedded wallet login issues",
    component: <AffectedAreaInput />,
  },
  {
    label: "Embedded wallet transaction issues",
    component: <AffectedAreaInput />,
  },
  {
    label: "Embedded wallet Custom Auth",
    component: <AffectedAreaInput />,
  },
  {
    label: "Account Abstraction",
    component: <AffectedAreaInput />,
  },
  {
    label: "In-app wallet",
    component: <AffectedAreaInput />,
  },
  {
    label: "Connect SDKs",
    component: (
      <>
        <SDKVersionInput />
        <SupportForm_TextInput
          formLabel="Application URL"
          formValue="extraInfo_Application_URL"
          required={false}
          inputType="url"
        />
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
  {
    label: "Unity SDK",
    component: (
      <>
        <UnitySupportForm />
        <SDKVersionInput />
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
  {
    label: ".NET SDK",
    component: (
      <>
        <SDKVersionInput />
        <SupportForm_SelectInput
          formLabel="OS"
          formValue="extraInfo_OS"
          required={true}
          promptText="Select an operating system"
          options={["Windows", "MacOS", "Linux", "Other"]}
        />
        <SupportForm_TextInput
          formLabel="Framework"
          formValue="extraInfo_dotNET_Framework"
          required={false}
          placeholder="MAUI | Blazor | Godot, etc"
          inputType="text"
        />
        <SupportForm_TextInput
          formLabel="Target OS"
          formValue="extraInfo_dotNET_Target_OS"
          required={false}
          inputType="text"
        />
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
  {
    label: "Pay",
    component: <AffectedAreaInput />,
  },
  {
    label: "Auth",
    component: <AffectedAreaInput />,
  },
];

export default function ConnectSupportForm() {
  const selectedProblemArea: string =
    useWatch<CreateTicketInput>({
      name: "extraInfo_Problem_Area",
    }) || "";

  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        formValue="extraInfo_Problem_Area"
        promptText="Select a problem area"
        options={PROBLEM_AREAS.map((o) => o.label)}
        required={true}
      />
      {PROBLEM_AREAS.find((o) => o.label === selectedProblemArea)?.component}
    </>
  );
}
