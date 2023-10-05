import { ContractPayload } from "./ContractPayload";

export type CompileOptions = {
  clean: boolean;
  projectPath: string;
  name: string;
  zksync?: boolean;
};

export interface IBuilder {
  /**
   * Compiles the project and returns the project object.
   *
   * @param project - The path to the project to compile.
   */
  compile(options: CompileOptions): Promise<{
    contracts: ContractPayload[];
  }>;
}
