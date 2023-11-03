import type { Chain } from "../types";
export default {
  "chain": "HAPchain",
  "chainId": 8794598,
  "explorers": [
    {
      "name": "HAP EVM Explorer (Blockscout)",
      "url": "https://blockscout.hap.land",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmQ4V9JC25yUrYk2kFJwmKguSsZBQvtGcg6q9zkDV8mkJW",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQ4V9JC25yUrYk2kFJwmKguSsZBQvtGcg6q9zkDV8mkJW",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://hap.land",
  "name": "HAPchain",
  "nativeCurrency": {
    "name": "HAP",
    "symbol": "HAP",
    "decimals": 18
  },
  "networkId": 8794598,
  "rpc": [
    "https://hapchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8794598.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.hap.land"
  ],
  "shortName": "hap",
  "slug": "hapchain",
  "testnet": false
} as const satisfies Chain;