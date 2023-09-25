import type { Chain } from "../src/types";
export default {
  "chainId": 2332,
  "chain": "SOMA",
  "name": "SOMA Network Mainnet",
  "rpc": [
    "https://soma-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://data-mainnet-v1.somanetwork.io/",
    "https://id-mainnet.somanetwork.io",
    "https://hk-mainnet.somanetwork.io",
    "https://sg-mainnet.somanetwork.io"
  ],
  "slug": "soma-network",
  "icon": {
    "url": "ipfs://QmadSU2tcyvuzssDYGJ4rVLag43QLnKwcBerZR2zKLVU2N",
    "width": 500,
    "height": 500,
    "format": "png"
  },
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
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [
    {
      "name": "SOMA Explorer Mainnet",
      "url": "https://somascan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;