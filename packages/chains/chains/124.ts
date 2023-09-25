import type { Chain } from "../src/types";
export default {
  "chainId": 124,
  "chain": "DWU",
  "name": "Decentralized Web Mainnet",
  "rpc": [
    "https://decentralized-web.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://decentralized-web.tech/dw_rpc.php"
  ],
  "slug": "decentralized-web",
  "faucets": [],
  "nativeCurrency": {
    "name": "Decentralized Web Utility",
    "symbol": "DWU",
    "decimals": 18
  },
  "infoURL": "https://decentralized-web.tech/dw_chain.php",
  "shortName": "dwu",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;