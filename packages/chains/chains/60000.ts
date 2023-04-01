import type { Chain } from "../src/types";
export default {
  "name": "Thinkium Testnet Chain 0",
  "chain": "Thinkium",
  "rpc": [],
  "faucets": [
    "https://www.thinkiumdev.net/faucet"
  ],
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "infoURL": "https://thinkium.net/",
  "shortName": "TKM-test0",
  "chainId": 60000,
  "networkId": 60000,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test0.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "thinkium-testnet-chain-0"
} as const satisfies Chain;