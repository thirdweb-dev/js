import type { Chain } from "../src/types";
export default {
  "chain": "Jumbo",
  "chainId": 1009,
  "explorers": [
    {
      "name": "Jumboscan",
      "url": "https://jumboscan.jumbochain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://jumbochain.org",
  "name": "Jumbochain Mainnet",
  "nativeCurrency": {
    "name": "JNFTC",
    "symbol": "JNFTC",
    "decimals": 18
  },
  "networkId": 1009,
  "rpc": [
    "https://1009.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcpriv.jumbochain.org"
  ],
  "shortName": "Jumboscan",
  "slip44": 1,
  "slug": "jumbochain",
  "testnet": false
} as const satisfies Chain;