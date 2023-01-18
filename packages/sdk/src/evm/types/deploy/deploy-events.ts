export interface DeployEvent {
  transactionHash: string;
  contractAddress: string;
}

export interface DeployEvents {
  contractDeployed: [DeployEvent];
}
