import { CompilerType } from "../../schema/contracts/custom";

export type CompilerOptions = {
  compilerType: CompilerType;
  compilerVersion?: string;
  evmVersion?: string;
};
