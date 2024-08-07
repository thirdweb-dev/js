import type { Chain } from "../src/types";
export default {
  "chain": "darwinia",
  "chainId": 46,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.darwinia.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://darwinia.network",
  "name": "Darwinia Network",
  "nativeCurrency": {
    "name": "Darwinia Network Native Token",
    "symbol": "RING",
    "decimals": 18
  },
  "networkId": 46,
  "rpc": [
    "https://46.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.darwinia.network",
    "https://darwinia-rpc.dcdao.box",
    "https://darwinia-rpc.dwellir.com"
  ],
  "shortName": "darwinia",
  "slug": "darwinia-network",
  "testnet": false
} as const satisfies Chain;