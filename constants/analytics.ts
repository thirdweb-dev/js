import { ContractType } from "@thirdweb-dev/sdk";

export class AnalyticsEvents {
  static ContractDeployed = "App-ContractDeployed";

  // TODO update these events to v2 events
  // for now we will be using v1 events to keep them compatible with v1 dashboards
  static DeploymentEvents: Record<ContractType, string> = {
    token: "App-CurrencyContractDeployed",
    "nft-collection": "App-NftContractDeployed",
    edition: "App-NftCollectionContractDeployed",
    marketplace: "App-MarketContractDeployed",
    pack: "App-PackContractDeployed",
    "nft-drop": "App-DropContractDeployed",
    "edition-drop": "App-BundleDropContractDeployed",
    split: "App-SplitsContractDeployed",
    vote: "App-VoteContractDeployed",
    "token-drop": "App-TokenDropContractDeployed",
    custom: "App-CustomContractDeployed",
    "signature-drop": "App-SignatureDropContractDeployed",
  };
}
