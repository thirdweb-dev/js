import type { Chain } from "../src/types";
export default {
  "chain": "STEP",
  "chainId": 12345,
  "explorers": [
    {
      "name": "StepScan",
      "url": "https://testnet.stepscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.step.network"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmVp9jyb3UFW71867yVtymmiRw7dPY4BTnsp3hEjr9tn8L",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://step.network",
  "name": "Step Testnet",
  "nativeCurrency": {
    "name": "FITFI",
    "symbol": "FITFI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://step-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.step.network"
  ],
  "shortName": "steptest",
  "slug": "step-testnet",
  "testnet": true
} as const satisfies Chain;