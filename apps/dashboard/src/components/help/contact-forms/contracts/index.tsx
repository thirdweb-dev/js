import { type ReactElement, useState } from "react";
import { AttachmentForm } from "../shared/SupportForm_AttachmentUploader";
import { DescriptionInput } from "../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../shared/SupportForm_SelectInput";
import { SupportForm_TextInput } from "../shared/SupportForm_TextInput";

type ProblemAreaItem = {
  label: string;
  component: ReactElement;
};

const NetworkInput = () => (
  <SupportForm_TextInput
    formLabel="Network"
    formValue="extraInfo_Network"
    inputType="text"
    required={true}
    placeholder="Network name or chain ID"
  />
);

const ContractAddressInput = () => (
  <SupportForm_TextInput
    formLabel="Contract address"
    formValue="extraInfo_Contract_Address"
    required={true}
    inputType="text"
  />
);

const ContractFunctionInput = () => (
  <SupportForm_TextInput
    formLabel="Contract function"
    formValue="extraInfo_Contract_Function"
    required={true}
    inputType="text"
  />
);

const ContractTypeInput = () => (
  <SupportForm_TextInput
    formLabel="Contract type"
    formValue="extraInfo_Contract_Type"
    required={false}
    inputType="text"
    placeholder={`"MarketplaceV3 | "NFTDrop" | ...`}
  />
);

const ContractAffectedAreaInput = () => {
  const [selectedAffectedArea, setSelectedAffectedArea] = useState<string>("");
  return (
    <SupportForm_SelectInput
      formLabel="Contract affected area"
      name="extraInfo_Affected_Area"
      options={["Dashboard", "SDK"]}
      required={true}
      promptText="Select an affected area"
      value={selectedAffectedArea}
      onValueChange={setSelectedAffectedArea}
    />
  );
};

const CONTRACT_PROBLEM_AREAS: ProblemAreaItem[] = [
  {
    label: "Deploying a contract",
    component: (
      <>
        <NetworkInput />
        <ContractTypeInput />
        <ContractAffectedAreaInput />
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
  {
    label: "Contract verification",
    component: (
      <>
        <NetworkInput />
        <ContractAddressInput />
        <ContractTypeInput />
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
  {
    label: "Calling a function in my contract",
    component: (
      <>
        <NetworkInput />
        <ContractAddressInput />
        <ContractFunctionInput />
        <ContractAffectedAreaInput />
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
  {
    label: "Developing a custom contract",
    component: (
      <>
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
  {
    label: "Other",
    component: (
      <>
        <DescriptionInput />
        <AttachmentForm />
      </>
    ),
  },
];

export default function ContractSupportForm() {
  const [problemArea, setProblemArea] = useState<string>("");
  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        name="extraInfo_Problem_Area"
        promptText="Select a problem area"
        options={CONTRACT_PROBLEM_AREAS.map((o) => o.label)}
        required={true}
        value={problemArea}
        onValueChange={setProblemArea}
      />
      {CONTRACT_PROBLEM_AREAS.find((o) => o.label === problemArea)?.component}
    </>
  );
}
