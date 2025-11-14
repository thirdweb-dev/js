import { useState } from "react";
import { DescriptionInput } from "../../shared/SupportForm_DescriptionInput";
import { SupportForm_TextInput } from "../../shared/SupportForm_TextInput";

export function TokensMarketplaceSupportForm() {
  const [description, setDescription] = useState<string>("");

  return (
    <>
      <SupportForm_TextInput
        formLabel="Token address or symbol"
        formValue="extraInfo_Token_Address_Symbol"
        inputType="text"
        placeholder="Enter token address or symbol (e.g. 0x... or ETH)"
        required={true}
      />
      <SupportForm_TextInput
        formLabel="Chain"
        formValue="extraInfo_TokensMarketplace_Chain"
        inputType="text"
        placeholder="e.g. Ethereum, Polygon, etc."
        required={true}
      />
      <SupportForm_TextInput
        formLabel="Support ID in logs"
        formValue="extraInfo_Support_ID_Logs"
        inputType="text"
        placeholder="Enter support ID from logs"
        required={false}
      />
      <DescriptionInput value={description} onChange={setDescription} />
    </>
  );
}
