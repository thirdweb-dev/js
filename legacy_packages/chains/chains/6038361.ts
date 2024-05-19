import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 6038361,
  "explorers": [
    {
      "name": "Blockscout zKyoto explorer",
      "url": "https://astar-zkyoto.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "Astar zkEVM Testnet zKyoto",
      "url": "https://zkyoto.explorer.startale.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://astar.network",
  "name": "Astar zKyoto",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 6038361,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  },
  "redFlags": [],
  "rpc": [
    "https://6038361.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.startale.com/zkyoto",
    "https://rpc.zkyoto.gelato.digital"
  ],
  "shortName": "azkyt",
  "slug": "astar-zkyoto",
  "testnet": true,
  "title": "Astar zkEVM Testnet zKyoto"
} as const satisfies Chain;