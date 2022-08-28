/**
 * Represents an uploaded contract.
 */
export interface Contract {
  /**
   * The name of the contract.
   */
  name: string;

  /**
   * The uri that points to the projects bytecode (stored in decentralized storage)
   */
  bytecodeUri: string;

  /**
   * The uri that points to the projects abi (stored in decentralized storage)
   */
  abiUri: string;
}
