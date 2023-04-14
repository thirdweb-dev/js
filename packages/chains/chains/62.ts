import type { Chain } from "../src/types";
export default {
  "name": "Ethereum Classic Testnet Morden",
  "chain": "ETC",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ethereum Classic Testnet Ether",
    "symbol": "TETC",
    "decimals": 18
  },
  "infoURL": "https://ethereumclassic.org",
  "shortName": "tetc",
  "chainId": 62,
  "networkId": 2,
  "testnet": true,
  "slug": "ethereum-classic-testnet-morden"
} as const satisfies Chain;