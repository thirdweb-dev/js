import {
  FullPublishMetadata,
  PreDeployMetadataFetched,
} from "../../schema/contracts/custom";
import { DeployedContractType } from "../any-evm/deploy-data";

export type DeployOptions = {
  forceDirectDeploy?: boolean;
  notifier?: (
    status: "deploying" | "deployed",
    contractType: DeployedContractType,
  ) => void;
};

export type DeployMetadata = {
  compilerMetadata: PreDeployMetadataFetched;
  extendedMetadata?: FullPublishMetadata;
};
