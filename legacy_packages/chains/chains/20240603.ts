import type { Chain } from "../src/types";
export default {
  "chain": "DBK Chain",
  "chainId": 20240603,
  "explorers": [
    {
      "name": "DBK Chain Explorer",
      "url": "https://scan.dbkchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeib7ovny3xkl4nr4a5oqvoqwf7dcjtqavydysclfmbavbl2oekhxty",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "infoURL": "https://docs.dbkchain.io",
  "name": "DBK Chain",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 20240603,
  "rpc": [
    "https://20240603.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.dbkchain.io"
  ],
  "shortName": "dbkchain",
  "slug": "dbk-chain",
  "testnet": false
} as const satisfies Chain;