import type { Chain } from "../types";
export default {
  "chain": "Tomb Chain",
  "chainId": 6969,
  "explorers": [
    {
      "name": "tombscout",
      "url": "https://tombscout.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://tombchain.com/",
  "name": "Tomb Chain Mainnet",
  "nativeCurrency": {
    "name": "Tomb",
    "symbol": "TOMB",
    "decimals": 18
  },
  "networkId": 6969,
  "parent": {
    "type": "L2",
    "chain": "eip155-250",
    "bridges": [
      {
        "url": "https://lif3.com/bridge"
      }
    ]
  },
  "rpc": [
    "https://tomb-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6969.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tombchain.com/"
  ],
  "shortName": "tombchain",
  "slug": "tomb-chain",
  "testnet": false
} as const satisfies Chain;