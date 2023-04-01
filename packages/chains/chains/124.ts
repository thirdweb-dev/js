import type { Chain } from "../src/types";
export default {
  "name": "Decentralized Web Mainnet",
  "shortName": "dwu",
  "chain": "DWU",
  "chainId": 124,
  "networkId": 124,
  "rpc": [],
  "faucets": [],
  "infoURL": "https://decentralized-web.tech/dw_chain.php",
  "nativeCurrency": {
    "name": "Decentralized Web Utility",
    "symbol": "DWU",
    "decimals": 18
  },
  "testnet": false,
  "slug": "decentralized-web"
} as const satisfies Chain;