import type { Chain } from "../src/types";
export default {
  "chain": "DWU",
  "chainId": 124,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://decentralized-web.tech/dw_chain.php",
  "name": "Decentralized Web Mainnet",
  "nativeCurrency": {
    "name": "Decentralized Web Utility",
    "symbol": "DWU",
    "decimals": 18
  },
  "networkId": 124,
  "rpc": [
    "https://124.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://decentralized-web.tech/dw_rpc.php"
  ],
  "shortName": "dwu",
  "slug": "decentralized-web",
  "testnet": false
} as const satisfies Chain;