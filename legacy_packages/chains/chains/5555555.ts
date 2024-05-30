import type { Chain } from "../src/types";
export default {
  "chain": "Imversed",
  "chainId": 5555555,
  "explorers": [
    {
      "name": "Imversed EVM explorer (Blockscout)",
      "url": "https://txe.imversed.network",
      "standard": "EIP3091"
    },
    {
      "name": "Imversed Cosmos Explorer (Big Dipper)",
      "url": "https://tex-c.imversed.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://imversed.com",
  "name": "Imversed Mainnet",
  "nativeCurrency": {
    "name": "Imversed Token",
    "symbol": "IMV",
    "decimals": 18
  },
  "networkId": 5555555,
  "rpc": [
    "https://5555555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.imversed.network",
    "https://ws-jsonrpc.imversed.network"
  ],
  "shortName": "imversed",
  "slug": "imversed",
  "testnet": false
} as const satisfies Chain;