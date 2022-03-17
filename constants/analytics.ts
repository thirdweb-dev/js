export class AnalyticsEvents {
  static ContractDeployed = "App-ContractDeployed";

  static DeploymentEvents = {
    TokenContract: "App-CurrencyContractDeployed",
    NftContract: "App-NftContractDeployed",
    NftCollectionContract: "App-NftCollectionContractDeployed",
    MarketContract: "App-MarketContractDeployed",
    PackContract: "App-PackContractDeployed",
    DropContract: "App-DropContractDeployed",
    BundleDropContract: "App-BundleDropContractDeployed",
    SplitsContract: "App-SplitsContractDeployed",
    VoteContract: "App-VoteContractDeployed",
  };

  static AppCreated = "App-AppCreated";
}
