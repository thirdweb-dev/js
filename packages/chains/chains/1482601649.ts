import type { Chain } from "../src/types";
export default {
  "chain": "green-giddy-denebola",
  "chainId": 1482601649,
  "explorers": [
    {
      "name": "nebula",
      "url": "https://green-giddy-denebola.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://nebulachain.io/",
  "name": "Nebula Mainnet",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://nebula.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/green-giddy-denebola",
    "wss://mainnet-proxy.skalenodes.com/v1/ws/green-giddy-denebola"
  ],
  "shortName": "nebula-mainnet",
  "slug": "nebula",
  "testnet": false
} as const satisfies Chain;