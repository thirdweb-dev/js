import type { Chain } from "../src/types";
export default {
  "chainId": 12345,
  "chain": "STEP",
  "name": "Step Testnet",
  "rpc": [
    "https://step-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.step.network"
  ],
  "slug": "step-testnet",
  "icon": {
    "url": "ipfs://QmVp9jyb3UFW71867yVtymmiRw7dPY4BTnsp3hEjr9tn8L",
    "width": 512,
    "height": 512,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "StepScan",
      "url": "https://testnet.stepscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;