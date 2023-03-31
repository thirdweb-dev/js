import { BytesLike } from "ethers";

export interface ExtensionMetadata {
  name: string;
  metadataURI: string;
  implementation: string;
}

export interface ExtensionFunction {
  functionSelector: BytesLike;
  functionSignature: string;
}

export interface Extension {
  metadata: ExtensionMetadata;
  functions: ExtensionFunction[];
}

export interface ExtensionDeployArgs {
  name: string;
  amount: number;
  salt: string;
  bytecode: string;
}
