export default {
  "name": "Step Network",
  "title": "Step Main Network",
  "chain": "STEP",
  "icon": {
    "url": "ipfs://QmVp9jyb3UFW71867yVtymmiRw7dPY4BTnsp3hEjr9tn8L",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://step-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.step.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "FITFI",
    "symbol": "FITFI",
    "decimals": 18
  },
  "infoURL": "https://step.network",
  "shortName": "step",
  "chainId": 1234,
  "networkId": 1234,
  "explorers": [
    {
      "name": "StepScan",
      "url": "https://stepscan.io",
      "icon": "step",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-43114",
    "bridges": [
      {
        "url": "https://bridge.step.network"
      }
    ]
  },
  "testnet": false,
  "slug": "step-network"
} as const;