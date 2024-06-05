import type { Chain } from "../src/types";
export default {
  "chain": "Oraichain",
  "chainId": 108160679,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://orai.io",
  "name": "Oraichain Mainnet",
  "nativeCurrency": {
    "name": "Oraichain Token",
    "symbol": "ORAI",
    "decimals": 18
  },
  "networkId": 108160679,
  "rpc": [
    "https://108160679.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.orai.io"
  ],
  "shortName": "Oraichain",
  "slug": "oraichain",
  "testnet": false,
  "title": "Oraichain Mainnet"
} as const satisfies Chain;