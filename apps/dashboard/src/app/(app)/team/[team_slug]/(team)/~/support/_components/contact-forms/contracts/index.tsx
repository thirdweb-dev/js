import { type ReactElement, useState } from "react";
import { DescriptionInput } from "../../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../../shared/SupportForm_SelectInput";
import { SupportForm_TextInput } from "../../shared/SupportForm_TextInput";

type ProblemAreaItem = {
  label: string;
  component: ReactElement;
};

const NetworkInput = () => (
  <SupportForm_TextInput
    formLabel="Network"
    formValue="extraInfo_Network"
    inputType="text"
    placeholder="Network name or chain ID"
    required={true}
  />
);

const ContractAddressInput = () => (
  <SupportForm_TextInput
    formLabel="Contract address"
    formValue="extraInfo_Contract_Address"
    inputType="text"
    required={true}
  />
);

const ContractFunctionInput = () => (
  <SupportForm_TextInput
    formLabel="Contract function"
    formValue="extraInfo_Contract_Function"
    inputType="text"
    required={true}
  />
);

const ContractTypeInput = () => (
  <SupportForm_TextInput
    formLabel="Contract type"
    formValue="extraInfo_Contract_Type"
    inputType="text"
    placeholder={`"MarketplaceV3 | "NFTDrop" | ...`}
    required={false}
  />
);

const ContractAffectedAreaInput = () => {
  const [selectedAffectedArea, setSelectedAffectedArea] = useState<string>("");
  return (
    <SupportForm_SelectInput
      formLabel="Contract affected area"
      name="extraInfo_Affected_Area"
      onValueChange={setSelectedAffectedArea}
      options={["Dashboard", "SDK"]}
      promptText="Select an affected area"
      required={true}
      value={selectedAffectedArea}
    />
  );
};

const CONTRACT_PROBLEM_AREAS: ProblemAreaItem[] = [
  {
    component: (
      <>
        <NetworkInput />
        <ContractTypeInput />
        <ContractAffectedAreaInput />
        <DescriptionInput />
      </>
    ),
    label: "Deploying a contract",
  },
  {
    component: (
      <>
        <NetworkInput />
        <ContractAddressInput />
        <ContractTypeInput />
        <DescriptionInput />
      </>
    ),
    label: "Contract verification",
  },
  {
    component: (
      <>
        <NetworkInput />
        <ContractAddressInput />
        <ContractFunctionInput />
        <ContractAffectedAreaInput />
        <DescriptionInput />
      </>
    ),
    label: "Calling a function in my contract",
  },
  {
    component: (
      <>
        <DescriptionInput />
      </>
    ),
    label: "Developing a custom contract",
  },
  {
    component: (
      <>
        <DescriptionInput />
      </>
    ),
    label: "Other",
  },
];

export function ContractSupportForm() {
  const [problemArea, setProblemArea] = useState<string>("");
  return (
    <>
      <SupportForm_SelectInput
        formLabel="Problem area"
        name="extraInfo_Problem_Area"
        onValueChange={setProblemArea}
        options={CONTRACT_PROBLEM_AREAS.map((o) => o.label)}
        promptText="Select a problem area"
        required={true}
        value={problemArea}
      />
      {CONTRACT_PROBLEM_AREAS.find((o) => o.label === problemArea)?.component}
    </>
  );
}
