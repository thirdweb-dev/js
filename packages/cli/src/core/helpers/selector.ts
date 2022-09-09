import { ContractPayload } from "../interfaces/ContractPayload";
import chalk from "chalk";

const { MultiSelect } = require("enquirer");

export function createContractsPrompt(
  choices: { name: string; value: ContractPayload }[],
  message: string,
) {
  return new MultiSelect({
    name: "value",
    message,
    hint: "Use <space> to select, <return> to submit",
    choices,
    result(names: string) {
      return this.map(names);
    },
    onSubmit() {
      if (this.selected.length === 0) {
        this.enable(this.focused);
      }
    },
    indicator(state: any, choice: any) {
      if (choice.enabled) {
        return this.styles.primary(this.symbols.hexagon.on);
      }
      return this.symbols.hexagon.off;
    },
    styles: {
      primary: chalk.blueBright,
      get em() {
        return this.primary;
      },
    },
  });
}
