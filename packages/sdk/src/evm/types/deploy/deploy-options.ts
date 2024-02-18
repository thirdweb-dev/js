import {
  FullPublishMetadata,
  PreDeployMetadataFetched,
} from "../../schema/contracts/custom";
import { DeployedContractType, HookOptions } from "../any-evm/deploy-data";

export type DeployOptions = {
  forceDirectDeploy?: boolean;
  saltForProxyDeploy?: string;
  hooks?: HookOptions[];
  notifier?: (
    status: "deploying" | "deployed",
    contractType: DeployedContractType | string,
  ) => void;
};

export type DeployMetadata = {
  compilerMetadata: PreDeployMetadataFetched;
  extendedMetadata?: FullPublishMetadata;
};
