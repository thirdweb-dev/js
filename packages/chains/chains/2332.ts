import type { Chain } from "../src/types";
export default {
  "name": "SOMA Network Mainnet",
  "chain": "SOMA",
  "rpc": [
    "https://soma-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-mainnet-v1.somanetwork.io/"
  ],
  "faucets": [
    "https://airdrop.somanetwork.io"
  ],
  "nativeCurrency": {
    "name": "Soma Native Token",
    "symbol": "SMA",
    "decimals": 18
  },
  "infoURL": "https://somanetwork.io",
  "shortName": "smam",
  "chainId": 2332,
  "networkId": 2332,
  "icon": {
    "url": "ipfs://QmadSU2tcyvuzssDYGJ4rVLag43QLnKwcBerZR2zKLVU2N",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "status": "incubating",
  "explorers": [
    {
      "name": "SOMA Explorer Mainnet",
      "icon": {
        "url": "ipfs://QmadSU2tcyvuzssDYGJ4rVLag43QLnKwcBerZR2zKLVU2N",
        "width": 500,
        "height": 500,
        "format": "png"
      },
      "url": "https://somascan.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "soma-network"
} as const satisfies Chain;