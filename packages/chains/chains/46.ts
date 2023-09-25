import type { Chain } from "../src/types";
export default {
  "chainId": 46,
  "chain": "darwinia",
  "name": "Darwinia Network",
  "rpc": [
    "https://darwinia-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.darwinia.network",
    "https://darwinia-rpc.darwiniacommunitydao.xyz",
    "https://darwinia2.api.onfinality.io/public-ws",
    "https://darwinia-rpc.dwellir.com"
  ],
  "slug": "darwinia-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Darwinia Network Native Token",
    "symbol": "RING",
    "decimals": 18
  },
  "infoURL": "https://darwinia.network/",
  "shortName": "darwinia",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "subscan",
      "url": "https://darwinia.subscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;