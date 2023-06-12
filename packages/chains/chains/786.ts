import type { Chain } from "../src/types";
export default {
  "name": "MAAL Sharia Chain",
  "chain": "MAAL",
  "icon": {
    "url": "ipfs://bafkreiexfqfe2x4impvwhra3xxa5eb25gv25zi3kkaoatdnld7wbxdzf2a",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://maal-sharia-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1-mainnet.maalscan.io/",
    "https://node2-mainnet.maalscan.io/",
    "https://node3-mainnet.maalscan.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "MAAL",
    "symbol": "MAAL",
    "decimals": 18
  },
  "infoURL": "https://www.maalblockchain.com/",
  "shortName": "maal",
  "chainId": 786,
  "networkId": 786,
  "explorers": [
    {
      "name": "maalscan",
      "url": "https://maalscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "maal-sharia-chain"
} as const satisfies Chain;