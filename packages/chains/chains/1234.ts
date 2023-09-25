import type { Chain } from "../src/types";
export default {
  "chainId": 1234,
  "chain": "STEP",
  "name": "Step Network",
  "rpc": [
    "https://step-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.step.network"
  ],
  "slug": "step-network",
  "icon": {
    "url": "ipfs://QmVp9jyb3UFW71867yVtymmiRw7dPY4BTnsp3hEjr9tn8L",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "FITFI",
    "symbol": "FITFI",
    "decimals": 18
  },
  "infoURL": "https://step.network",
  "shortName": "step",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "StepScan",
      "url": "https://stepscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;