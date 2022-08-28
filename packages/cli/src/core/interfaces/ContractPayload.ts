/**
 * Represents the raw compiled contract data.
 */
export interface ContractPayload {
  /**
   * The name of the contract (with the .sol extension)
   */
  name: string;

  /**
   * The raw bytecode of the contract
   */
  bytecode: string;

  /**
   * The compiler metadata object or file
   */
  metadata: any;

  /**
   * The source file paths
   */
  sources: string[];
}
