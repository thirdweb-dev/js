import type { Chain } from "../src/types";
export default {
  "chainId": 8794598,
  "chain": "HAPchain",
  "name": "HAPchain",
  "rpc": [
    "https://hapchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.hap.land"
  ],
  "slug": "hapchain",
  "icon": {
    "url": "ipfs://QmQ4V9JC25yUrYk2kFJwmKguSsZBQvtGcg6q9zkDV8mkJW",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "HAP",
    "symbol": "HAP",
    "decimals": 18
  },
  "infoURL": "https://hap.land",
  "shortName": "hap",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "HAP EVM Explorer (Blockscout)",
      "url": "https://blockscout.hap.land",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;