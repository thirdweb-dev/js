import type { Chain } from "../src/types";
export default {
  "chain": "MINTME",
  "chainId": 24734,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.mintme.com",
  "name": "MintMe.com Coin",
  "nativeCurrency": {
    "name": "MintMe.com Coin",
    "symbol": "MINTME",
    "decimals": 18
  },
  "networkId": 37480,
  "rpc": [
    "https://24734.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.mintme.com"
  ],
  "shortName": "mintme",
  "slug": "mintme-com-coin",
  "testnet": false
} as const satisfies Chain;