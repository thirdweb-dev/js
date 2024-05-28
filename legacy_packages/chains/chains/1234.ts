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
  "infoURL": "https://step.network",
  "name": "Step Network",
  "nativeCurrency": {
    "name": "FITFI",
    "symbol": "FITFI",
    "decimals": 18
  },
  "networkId": 1234,
  "parent": {
    "type": "L2",
    "chain": "eip155-43114",
    "bridges": [
      {
        "url": "https://bridge.step.network"
      }
    ]
  },
  "rpc": [
    "https://1234.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.step.network"
  ],
  "shortName": "step",
  "slug": "step-network",
  "testnet": false,
  "title": "Step Main Network"
} as const satisfies Chain;