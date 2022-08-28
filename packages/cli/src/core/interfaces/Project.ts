import { Contract } from "./Contract";

export interface Project {
  /**
   * The name of the project.
   */
  name: string;

  /**
   * The contracts that make up this project.
   */
  contracts: Contract[];
}
