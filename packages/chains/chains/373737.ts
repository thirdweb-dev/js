import type { Chain } from "../src/types";
export default {
  "name": "HAPchain Testnet",
  "chain": "HAPchain",
  "rpc": [
    "https://hapchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc-test.hap.land"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "HAP",
    "symbol": "HAP",
    "decimals": 18
  },
  "infoURL": "https://hap.land",
  "shortName": "hap-testnet",
  "chainId": 373737,
  "networkId": 373737,
  "icon": {
    "url": "ipfs://QmQ4V9JC25yUrYk2kFJwmKguSsZBQvtGcg6q9zkDV8mkJW",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "explorers": [
    {
      "name": "HAP EVM Explorer (Blockscout)",
      "url": "https://blockscout-test.hap.land",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmQ4V9JC25yUrYk2kFJwmKguSsZBQvtGcg6q9zkDV8mkJW",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "testnet": true,
  "slug": "hapchain-testnet"
} as const satisfies Chain;