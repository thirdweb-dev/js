import { ContractPayload } from "./ContractPayload";

export type CompileOptions = {
  projectPath: string;
  name: string;
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
