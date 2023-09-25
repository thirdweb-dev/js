import type { Chain } from "../src/types";
export default {
  "chainId": 1482601649,
  "chain": "green-giddy-denebola",
  "name": "Nebula Mainnet",
  "rpc": [
    "https://nebula.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/green-giddy-denebola",
    "wss://mainnet-proxy.skalenodes.com/v1/ws/green-giddy-denebola"
  ],
  "slug": "nebula",
  "faucets": [],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://nebulachain.io/",
  "shortName": "nebula-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "nebula",
      "url": "https://green-giddy-denebola.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;