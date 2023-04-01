import type { Chain } from "../src/types";
export default {
  "name": "Web3Games Testnet",
  "chain": "Web3Games",
  "icon": {
    "url": "ipfs://QmUc57w3UTHiWapNW9oQb1dP57ymtdemTTbpvGkjVHBRCo",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Games",
    "symbol": "W3G",
    "decimals": 18
  },
  "infoURL": "https://web3games.org/",
  "shortName": "tw3g",
  "chainId": 102,
  "networkId": 102,
  "testnet": true,
  "slug": "web3games-testnet"
} as const satisfies Chain;