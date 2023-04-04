import type { Chain } from "../src/types";
export default {
  "name": "HAPchain",
  "chain": "HAPchain",
  "rpc": [
    "https://hapchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.hap.land"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "HAP",
    "symbol": "HAP",
    "decimals": 18
  },
  "infoURL": "https://hap.land",
  "shortName": "hap",
  "chainId": 8794598,
  "networkId": 8794598,
  "icon": {
    "url": "ipfs://QmQ4V9JC25yUrYk2kFJwmKguSsZBQvtGcg6q9zkDV8mkJW",
    "width": 400,
    "height": 400,
    "format": "png"
  },
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
  "testnet": false,
  "slug": "hapchain"
} as const satisfies Chain;