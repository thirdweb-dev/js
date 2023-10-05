import type { Chain } from "../src/types";
export default {
  "chain": "Web3Games",
  "chainId": 105,
  "explorers": [
    {
      "name": "Web3Games Explorer",
      "url": "https://explorer-devnet.web3games.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmUc57w3UTHiWapNW9oQb1dP57ymtdemTTbpvGkjVHBRCo",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "infoURL": "https://web3games.org/",
  "name": "Web3Games Devnet",
  "nativeCurrency": {
    "name": "Web3Games",
    "symbol": "W3G",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://web3games-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.web3games.org/evm"
  ],
  "shortName": "dw3g",
  "slug": "web3games-devnet",
  "testnet": false
} as const satisfies Chain;