import type { Chain } from "../src/types";
export default {
  "chain": "HAPchain",
  "chainId": 8794598,
  "explorers": [
    {
      "name": "HAP EVM Explorer (Blockscout)",
      "url": "https://blockscout.hap.land",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://hap.land",
  "name": "HAPchain",
  "nativeCurrency": {
    "name": "HAP",
    "symbol": "HAP",
    "decimals": 18
  },
  "networkId": 8794598,
  "rpc": [
    "https://8794598.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.hap.land"
  ],
  "shortName": "hap",
  "slug": "hapchain",
  "testnet": false
} as const satisfies Chain;