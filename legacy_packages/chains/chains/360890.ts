import type { Chain } from "../src/types";
export default {
  "chain": "LAVITA",
  "chainId": 360890,
  "explorers": [
    {
      "name": "LAVITA Mainnet Explorer",
      "url": "https://tsub360890-explorer.thetatoken.org",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmfHbWCxwSjf8qmg4yw8jySHZijRXTPW8f5xd2T5sjbeCY",
        "width": 1024,
        "height": 1024,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfHbWCxwSjf8qmg4yw8jySHZijRXTPW8f5xd2T5sjbeCY",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://www.lavita.ai",
  "name": "LAVITA Mainnet",
  "nativeCurrency": {
    "name": "vTFUEL",
    "symbol": "vTFUEL",
    "decimals": 18
  },
  "networkId": 360890,
  "rpc": [
    "https://360890.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tsub360890-eth-rpc.thetatoken.org/rpc"
  ],
  "shortName": "lavita-mainnet",
  "slug": "lavita",
  "testnet": false
} as const satisfies Chain;