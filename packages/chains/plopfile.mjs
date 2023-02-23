const chainIdPrompt = {
  type: "number",
  name: "chainId",
  message: "Chain ID",
  validate: (value) => {
    if (value.length === 0) {
      return "ChainId is required";
    }
    if (!/^\d+$/.test(value)) {
      return "ChainId must be a number";
    }
    return true;
  },
};

const stringPrompt = (id, title, isRequired) => ({
  type: "input",
  name: id,
  message: title,
  validate: (value) => {
    if (isRequired && value.length === 0) {
      return `${title} is required`;
    }
    return true;
  },
});

const testnetPrompt = {
  type: "confirm",
  name: "isTestnet",
  message: "Is this a testnet?",
};

export default function (
  /** @type {import('plop').NodePlopAPI} */
  plop,
) {
  // add partials
  plop.setPartial("chainIdPartial", "chainId: {{chainId}},\n");
  plop.setPartial("namePartial", `name: "{{name}}",\n`);
  plop.setPartial("chainPartial", `chain: "{{chain}}",\n`);
  plop.setPartial("shortNamePartial", `shortName: "{{shortName}}",\n`);
  plop.setPartial("isTestnetPartial", `testnet: {{isTestnet}},\n`);

  plop.setGenerator("add-chain", {
    description: "add a new chain",
    prompts: [
      chainIdPrompt,
      stringPrompt("name", "Name", true),
      stringPrompt("chain", "Chain", true),
      stringPrompt("shortName", "Short Name", true),
      testnetPrompt,
    ],
    actions: [
      {
        type: "add",
        path: "data/additional/{{chainId}}.mjs",
        templateFile: "plop-templates/add-chain.hbs",
      },
    ],
  });

  plop.setGenerator("override-chain", {
    description: "add an override for a chain",
    prompts: [
      chainIdPrompt,
      stringPrompt("name", "Name"),
      stringPrompt("chain", "Chain"),
      stringPrompt("shortName", "Short Name"),
      testnetPrompt,
    ],
    actions: [
      {
        type: "add",
        path: "data/overrides/{{chainId}}.mjs",
        templateFile: "plop-templates/chain-override.hbs",
      },
    ],
  });
}
