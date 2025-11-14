"use client";

import { type ReactElement, useState } from "react";
import { DescriptionInput } from "../../shared/SupportForm_DescriptionInput";
import { SupportForm_SelectInput } from "../../shared/SupportForm_SelectInput";
import { SupportForm_TextInput } from "../../shared/SupportForm_TextInput";

type ProblemAreaItem = {
  label: string;
  component: ReactElement;
};

const SocialEmailLoginIssuesComponent = () => {
  const [description, setDescription] = useState<string>("");
  return (
    <>
      <SupportForm_TextInput
        formLabel="User ID/Email with issue"
        formValue="extraInfo_User_ID_Email"
        inputType="text"
        placeholder="Enter user ID or email"
        required={true}
      />
      <DescriptionInput value={description} onChange={setDescription} />
    </>
  );
};

const UserWalletCustomAuthComponent = () => {
  const [description, setDescription] = useState<string>("");
  return (
    <>
      <SupportForm_TextInput
        formLabel="Custom auth endpoint"
        formValue="extraInfo_Custom_Auth_Endpoint"
        inputType="text"
        placeholder="Enter custom auth endpoint"
        required={true}
      />
      <SupportForm_TextInput
        formLabel="Support ID"
        formValue="extraInfo_Support_ID"
        inputType="text"
        placeholder="Enter support ID (optional)"
        required={false}
      />
      <DescriptionInput value={description} onChange={setDescription} />
    </>
  );
};

const AccountAbstractionComponent = () => {
  const [description, setDescription] = useState<string>("");
  return (
    <>
      <SupportForm_TextInput
        formLabel="Support ID"
        formValue="extraInfo_Support_ID"
        inputType="text"
        placeholder="Enter support ID (optional)"
        required={false}
      />
      <DescriptionInput value={description} onChange={setDescription} />
    </>
  );
};

const ThirdPartyEOAWalletsComponent = () => {
  const [description, setDescription] = useState<string>("");
  return <DescriptionInput value={description} onChange={setDescription} />;
};

const PROBLEM_AREAS: ProblemAreaItem[] = [
  {
    component: <SocialEmailLoginIssuesComponent />,
    label: "Social/Email login issues",
  },
  {
    component: <UserWalletCustomAuthComponent />,
    label: "User wallet with custom auth",
  },
  {
    component: <AccountAbstractionComponent />,
    label: "Account Abstraction",
  },
  {
    component: <ThirdPartyEOAWalletsComponent />,
    label: "Third party/EOA wallets",
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
