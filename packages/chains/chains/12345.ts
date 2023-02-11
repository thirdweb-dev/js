export default {
  "name": "Step Testnet",
  "title": "Step Test Network",
  "chain": "STEP",
  "icon": {
    "url": "ipfs://QmVp9jyb3UFW71867yVtymmiRw7dPY4BTnsp3hEjr9tn8L",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://step-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.step.network"
  ],
  "faucets": [
    "https://faucet.step.network"
  ],
  "nativeCurrency": {
    "name": "FITFI",
    "symbol": "FITFI",
    "decimals": 18
  },
  "infoURL": "https://step.network",
  "shortName": "steptest",
  "chainId": 12345,
  "networkId": 12345,
  "explorers": [
    {
      "name": "StepScan",
      "url": "https://testnet.stepscan.io",
      "icon": "step",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-43113"
  },
  "testnet": true,
  "slug": "step-testnet"
} as const;