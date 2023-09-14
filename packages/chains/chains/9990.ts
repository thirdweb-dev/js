import type { Chain } from "../src/types";
export default {
  "name": "Agung Network",
  "chain": "Agung",
  "icon": {
    "url": "ipfs://bafkreih6nzctk6brx5cqkylxbhvi3vsr6q5ks4th5knolkrlfp4tdia2mu",
    "width": 400,
    "height": 400,
    "format": "svg"
  },
  "rpc": [
    "https://agung-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcpc1-qa.agung.peaq.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Agung",
    "symbol": "AGNG",
    "decimals": 18
  },
  "infoURL": "https://www.peaq.network",
  "shortName": "AGNG",
  "chainId": 9990,
  "networkId": 9990,
  "explorers": [
    {
      "name": "Polkadot.js",
      "url": "https://polkadot.js.org/apps/?rpc=wss://wsspc1-qa.agung.peaq.network#/explorer",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "agung-network"
} as const satisfies Chain;