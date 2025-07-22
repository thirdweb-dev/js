import { useState } from "react";
import { DescriptionInput } from "../../shared/SupportForm_DescriptionInput";
import { SupportForm_TextInput } from "../../shared/SupportForm_TextInput";

export function TokensMarketplaceSupportForm() {
  const [description, setDescription] = useState<string>("");

  return (
    <>
      <SupportForm_TextInput
        formLabel="Address"
        formValue="extraInfo_TokensMarketplace_Address"
        inputType="text"
        placeholder="Enter the relevant address"
        required={true}
      />
      <SupportForm_TextInput
        formLabel="Chain"
        formValue="extraInfo_TokensMarketplace_Chain"
        inputType="text"
        placeholder="e.g. Ethereum, Polygon, etc."
        required={true}
      />
      <DescriptionInput value={description} onChange={setDescription} />
    </>
  );
}
