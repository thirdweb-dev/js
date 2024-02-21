import type { Chain } from "../src/types";
export default {
  "chain": "Web3Games",
  "chainId": 102,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmUc57w3UTHiWapNW9oQb1dP57ymtdemTTbpvGkjVHBRCo",
    "width": 192,
    "height": 192,
    "format": "png"
  },
  "infoURL": "https://web3games.org/",
  "name": "Web3Games Testnet",
  "nativeCurrency": {
    "name": "Web3Games",
    "symbol": "W3G",
    "decimals": 18
  },
  "networkId": 102,
  "rpc": [
    "https://102.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc-0.web3games.org/evm",
    "https://testnet-rpc-1.web3games.org/evm",
    "https://testnet-rpc-2.web3games.org/evm"
  ],
  "shortName": "tw3g",
  "slip44": 1,
  "slug": "web3games-testnet",
  "testnet": true
} as const satisfies Chain;