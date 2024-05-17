import type { Chain } from "../src/types";
export default {
  "chain": "QIE",
  "chainId": 5656,
  "explorers": [
    {
      "name": "QIE Explorer",
      "url": "https://mainnet.qiblockchain.online",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRoNxCti6cHrPgZ48YQVSMg9g6ympfXuV8kGQJXrbbmed",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://qiblockchain.online/",
  "name": "QIE Blockchain",
  "nativeCurrency": {
    "name": "QIE Blockchain",
    "symbol": "QIE",
    "decimals": 18
  },
  "networkId": 5656,
  "rpc": [
    "https://5656.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-main1.qiblockchain.online/",
    "https://rpc-main2.qiblockchain.online/"
  ],
  "shortName": "QIE",
  "slug": "qie-blockchain",
  "testnet": false
} as const satisfies Chain;