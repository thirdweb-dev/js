import type { Chain } from "../src/types";
export default {
  "chain": "STEP",
  "chainId": 1234,
  "explorers": [
    {
      "name": "StepScan",
      "url": "https://stepscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmVp9jyb3UFW71867yVtymmiRw7dPY4BTnsp3hEjr9tn8L",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://step.network",
  "name": "Step Network",
  "nativeCurrency": {
    "name": "FITFI",
    "symbol": "FITFI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://step-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.step.network"
  ],
  "shortName": "step",
  "slug": "step-network",
  "testnet": false
} as const satisfies Chain;