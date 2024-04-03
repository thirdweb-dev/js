export interface Feature {
  /**
   * The name of the contract (with the .sol extension)
   */
  name: string;

  /**
   * The documentation for the contract extension
   */
  reference: string;
}

/**
 * Represents data about detected features on a contract
 */
export interface ContractFeatures {
  /**
   * The name of the contract (with the .sol extension)
   */
  name: string;

  /**
   * The features detected on the contract
   */
  enabledFeatures: Feature[];

  /**
   * The features suggested to implement on the contract
   */
  suggestedFeatures: Feature[];
}
