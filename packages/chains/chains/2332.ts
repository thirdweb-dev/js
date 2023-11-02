import type { Chain } from "../src/types";
export default {
  "chain": "SOMA",
  "chainId": 2332,
  "explorers": [
    {
      "name": "SOMA Explorer Mainnet",
      "url": "https://somascan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmadSU2tcyvuzssDYGJ4rVLag43QLnKwcBerZR2zKLVU2N",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://airdrop.somanetwork.io"
  ],
  "icon": {
    "url": "ipfs://QmadSU2tcyvuzssDYGJ4rVLag43QLnKwcBerZR2zKLVU2N",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://somanetwork.io",
  "name": "SOMA Network Mainnet",
  "nativeCurrency": {
    "name": "Soma Native Token",
    "symbol": "SMA",
    "decimals": 18
  },
  "networkId": 2332,
  "rpc": [
    "https://soma-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2332.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-mainnet-v1.somanetwork.io/",
    "https://id-mainnet.somanetwork.io",
    "https://hk-mainnet.somanetwork.io",
    "https://sg-mainnet.somanetwork.io"
  ],
  "shortName": "smam",
  "slug": "soma-network",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;