import type { SolidityType } from "@/types/solidity-types";

interface ReplacementProps {
  connectedWallet?: string;
  chainId?: number;
}

interface TemplateValue {
  value: string;
  helperText: string;
  replacerFunction: (
    searchValue: string,
    replacers: ReplacementProps,
  ) => string;
}

const ADDRESS_TEMPLATE_VALUES: TemplateValue[] = [
  {
    helperText: "Replaced with the address of the connected wallet.",
    replacerFunction: (searchValue, replacers) => {
      return searchValue.replaceAll(
        "{{connected_wallet}}",
        replacers.connectedWallet || "",
      );
    },
    value: "{{connected_wallet}}",
  },
];

const ADDRESS_ARRAY_TEMPLATE_VALUES: TemplateValue[] = [
  {
    helperText:
      "Replaced with the addresses of the trusted (gasless) forwarders for the selected network.",
    replacerFunction: (searchValue) => {
      const trustedForwardersForChain: string[] = [];
      return searchValue.replaceAll(
        "{{trusted_forwarders}}",
        JSON.stringify(trustedForwardersForChain),
      );
    },
    value: "{{trusted_forwarders}}",
  },
];

export function getTemplateValuesForType(type: SolidityType): TemplateValue[] {
  switch (type) {
    case "address":
      return ADDRESS_TEMPLATE_VALUES;
    case "address[]":
      return ADDRESS_ARRAY_TEMPLATE_VALUES;
    default:
      return [];
  }
}

export function replaceTemplateValues(
  value: string,
  type: SolidityType,
  replacers: ReplacementProps,
): string {
  const templateValues = getTemplateValuesForType(type);

  return templateValues.reduce((acc, templateValue) => {
    return templateValue.replacerFunction(acc, replacers);
  }, value);
}
