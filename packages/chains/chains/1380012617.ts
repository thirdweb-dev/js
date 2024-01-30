import type { Chain } from "../src/types";
export default {
  "chain": "Rari",
  "chainId": 1380012617,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmdAX6818vZ3bAsPRv1DZGrc7qc8XTrgCnRLWrMecixhXb/RARI%20Chain%20Logomark%20Color.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://rari-mainnet.caldera.dev/",
  "name": "Rari Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1380012617,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://rari.calderabridge.xyz/"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://rari.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1380012617.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.rpc.rarichain.org/http"
  ],
  "shortName": "rari",
  "slug": "rari",
  "testnet": false
} as const satisfies Chain;