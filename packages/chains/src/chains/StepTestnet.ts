import type { Chain } from "../types";
export default {
  "chain": "STEP",
  "chainId": 12345,
  "explorers": [
    {
      "name": "StepScan",
      "url": "https://testnet.stepscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmVp9jyb3UFW71867yVtymmiRw7dPY4BTnsp3hEjr9tn8L",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.step.network"
  ],
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
  "networkId": 12345,
  "parent": {
    "type": "L2",
    "chain": "eip155-43113"
  },
  "rpc": [
    "https://step-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://12345.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.step.network"
  ],
  "shortName": "steptest",
  "slug": "step-testnet",
  "testnet": true,
  "title": "Step Test Network"
} as const satisfies Chain;