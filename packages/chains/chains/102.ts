import type { Chain } from "../src/types";
export default {
  "chainId": 102,
  "chain": "Web3Games",
  "name": "Web3Games Testnet",
  "rpc": [
    "https://web3games-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc-0.web3games.org/evm",
    "https://testnet-rpc-1.web3games.org/evm",
    "https://testnet-rpc-2.web3games.org/evm"
  ],
  "slug": "web3games-testnet",
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
  "shortName": "tw3g",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;