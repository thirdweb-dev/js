import type { Chain } from "../src/types";
export default {
  "name": "Molereum Network",
  "chain": "ETH",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Molereum Ether",
    "symbol": "MOLE",
    "decimals": 18
  },
  "infoURL": "https://github.com/Jdubedition/molereum",
  "shortName": "mole",
  "chainId": 6022140761023,
  "networkId": 6022140761023,
  "testnet": false,
  "slug": "molereum-network"
} as const satisfies Chain;