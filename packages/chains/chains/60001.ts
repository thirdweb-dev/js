import type { Chain } from "../src/types";
export default {
  "chain": "Thinkium",
  "chainId": 60001,
  "explorers": [
    {
      "name": "thinkiumscan",
      "url": "https://test1.thinkiumscan.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.thinkiumdev.net/faucet"
  ],
  "infoURL": "https://thinkium.net/",
  "name": "Thinkium Testnet Chain 1",
  "nativeCurrency": {
    "name": "TKM",
    "symbol": "TKM",
    "decimals": 18
  },
  "networkId": 60001,
  "rpc": [
    "https://thinkium-testnet-chain-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://60001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test1.thinkiumrpc.net/"
  ],
  "shortName": "TKM-test1",
  "slip44": 1,
  "slug": "thinkium-testnet-chain-1",
  "testnet": true
} as const satisfies Chain;