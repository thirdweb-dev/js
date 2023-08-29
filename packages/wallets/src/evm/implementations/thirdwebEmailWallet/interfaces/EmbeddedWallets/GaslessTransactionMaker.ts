export type ContractCallInputType = {
  contractAddress: string;
  methodInterface: `function ${string}(${string})${string}` | string;
  methodArgs: Array<unknown>;
  // Future versions will allow additional value.
  // The user will be prompted to pay with a fiat checkout flow
  // for NFTs similar to Paper's current experience.
  // "payment": {
  //   "value": "0.1",
  //   "currency": "ETH"
  // }
};

export type CallContractReturnType = { transactionHash: string };
