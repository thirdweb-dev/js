import type { Chain } from "../src/types";
export default {
  "chain": "MAAL",
  "chainId": 786,
  "explorers": [
    {
      "name": "maalscan",
      "url": "https://maalscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreiexfqfe2x4impvwhra3xxa5eb25gv25zi3kkaoatdnld7wbxdzf2a",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.maalchain.com/",
  "name": "MAAL Chain",
  "nativeCurrency": {
    "name": "MAAL",
    "symbol": "MAAL",
    "decimals": 18
  },
  "networkId": 786,
  "rpc": [
    "https://786.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1-mainnet.maalscan.io/",
    "https://node2-mainnet.maalscan.io/",
    "https://node3-mainnet.maalscan.io/"
  ],
  "shortName": "maal",
  "slug": "maal-chain",
  "testnet": false
} as const satisfies Chain;