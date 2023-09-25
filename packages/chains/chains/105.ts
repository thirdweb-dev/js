import type { Chain } from "../src/types";
export default {
  "chainId": 105,
  "chain": "Web3Games",
  "name": "Web3Games Devnet",
  "rpc": [
    "https://web3games-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.web3games.org/evm"
  ],
  "slug": "web3games-devnet",
  "icon": {
    "url": "ipfs://QmUc57w3UTHiWapNW9oQb1dP57ymtdemTTbpvGkjVHBRCo",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Web3Games",
    "symbol": "W3G",
    "decimals": 18
  },
  "infoURL": "https://web3games.org/",
  "shortName": "dw3g",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Web3Games Explorer",
      "url": "https://explorer-devnet.web3games.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;