import {
  FullPublishMetadata,
  PreDeployMetadataFetched,
} from "../../schema/contracts/custom";
import { DeployedContractType } from "../any-evm/deploy-data";
import { CompilerOptions } from "../compiler/compiler-options";

export type DeployOptions = {
  forceDirectDeploy?: boolean;
  saltForProxyDeploy?: string;
  compilerOptions?: CompilerOptions;
  notifier?: (
    status: "deploying" | "deployed",
    contractType: DeployedContractType | string,
  ) => void;
};

export type DeployMetadata = {
  compilerMetadata: PreDeployMetadataFetched;
  extendedMetadata?: FullPublishMetadata;
};
