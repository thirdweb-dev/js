import type { Chain } from "../src/types";
export default {
  "chainId": 373737,
  "chain": "HAPchain",
  "name": "HAPchain Testnet",
  "rpc": [
    "https://hapchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc-test.hap.land"
  ],
  "slug": "hapchain-testnet",
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
  "shortName": "hap-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "HAP EVM Explorer (Blockscout)",
      "url": "https://blockscout-test.hap.land",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;