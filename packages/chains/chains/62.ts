import type { Chain } from "../src/types";
export default {
  "chainId": 62,
  "chain": "ETC",
  "name": "Ethereum Classic Testnet Morden",
  "rpc": [],
  "slug": "ethereum-classic-testnet-morden",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ethereum Classic Testnet Ether",
    "symbol": "TETC",
    "decimals": 18
  },
  "infoURL": "https://ethereumclassic.org",
  "shortName": "tetc",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;