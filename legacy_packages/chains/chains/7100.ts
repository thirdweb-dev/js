import type { Chain } from "../src/types";
export default {
  "chain": "Nume",
  "chainId": 7100,
  "explorers": [
    {
      "name": "numeexplorer",
      "url": "https://explorer.numecrypto.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://numecrypto.com",
  "name": "Nume",
  "nativeCurrency": {
    "name": "Dai Stablecoin",
    "symbol": "DAI",
    "decimals": 18
  },
  "networkId": 7100,
  "rpc": [
    "https://7100.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.numecrypto.com"
  ],
  "shortName": "nume",
  "slug": "nume",
  "testnet": false,
  "title": "Nume"
} as const satisfies Chain;