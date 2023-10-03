import type { Chain } from "../src/types";
export default {
  "chain": "MINTME",
  "chainId": 24734,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.mintme.com",
  "name": "MintMe.com Coin",
  "nativeCurrency": {
    "name": "MintMe.com Coin",
    "symbol": "MINTME",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://mintme-com-coin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.mintme.com"
  ],
  "shortName": "mintme",
  "slug": "mintme-com-coin",
  "testnet": false
} as const satisfies Chain;