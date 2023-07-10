import {
  FullPublishMetadata,
  PreDeployMetadataFetched,
} from "../../schema/contracts/custom";
import { DeployedContractType } from "../any-evm/deploy-data";

export type DeployOptions = {
  forceDirectDeploy?: boolean;
  saltForProxyDeploy?: string;
  notifier?: (
    status: "deploying" | "deployed",
    contractType: DeployedContractType | string,
  ) => void;
};

export type DeployMetadata = {
  compilerMetadata: PreDeployMetadataFetched;
  extendedMetadata?: FullPublishMetadata;
};
