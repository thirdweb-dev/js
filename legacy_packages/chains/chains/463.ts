import type { Chain } from "../src/types";
export default {
  "chain": "Areon",
  "chainId": 463,
  "explorers": [
    {
      "name": "AreonScan",
      "url": "https://areonscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://areon.network",
  "name": "Areon Network Mainnet",
  "nativeCurrency": {
    "name": "Areon",
    "symbol": "AREA",
    "decimals": 18
  },
  "networkId": 463,
  "rpc": [
    "https://463.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.areon.network",
    "https://mainnet-rpc2.areon.network",
    "https://mainnet-rpc3.areon.network",
    "https://mainnet-rpc4.areon.network",
    "https://mainnet-rpc5.areon.network"
  ],
  "shortName": "area",
  "slug": "areon-network",
  "testnet": false
} as const satisfies Chain;