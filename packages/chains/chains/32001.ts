import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 32001,
  "explorers": [
    {
      "name": "W3Gamez Holesky Explorer",
      "url": "https://w3gamez-holesky.web3games.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmUc57w3UTHiWapNW9oQb1dP57ymtdemTTbpvGkjVHBRCo",
        "width": 192,
        "height": 192,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmaQdiE7vwxKeuWCjk4nKBikcpg4XCzQkFWGrAZHmMKnrq",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://web3games.com/",
  "name": "W3Gamez Holesky Testnet",
  "nativeCurrency": {
    "name": "W3Gamez Testnet Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 32001,
  "rpc": [
    "https://32001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-holesky.w3gamez.network"
  ],
  "shortName": "w3gamez",
  "slip44": 1,
  "slug": "w3gamez-holesky-testnet",
  "testnet": true
} as const satisfies Chain;