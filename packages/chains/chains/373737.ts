import type { Chain } from "../src/types";
export default {
  "chain": "HAPchain",
  "chainId": 373737,
  "explorers": [
    {
      "name": "HAP EVM Explorer (Blockscout)",
      "url": "https://blockscout-test.hap.land",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQ4V9JC25yUrYk2kFJwmKguSsZBQvtGcg6q9zkDV8mkJW",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://hap.land",
  "name": "HAPchain Testnet",
  "nativeCurrency": {
    "name": "HAP",
    "symbol": "HAP",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://hapchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc-test.hap.land"
  ],
  "shortName": "hap-testnet",
  "slug": "hapchain-testnet",
  "testnet": true
} as const satisfies Chain;