import type { Chain } from "../src/types";
export default {
  "chainId": 24734,
  "chain": "MINTME",
  "name": "MintMe.com Coin",
  "rpc": [
    "https://mintme-com-coin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.mintme.com"
  ],
  "slug": "mintme-com-coin",
  "faucets": [],
  "nativeCurrency": {
    "name": "MintMe.com Coin",
    "symbol": "MINTME",
    "decimals": 18
  },
  "infoURL": "https://www.mintme.com",
  "shortName": "mintme",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;