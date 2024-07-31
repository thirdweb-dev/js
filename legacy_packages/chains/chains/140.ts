import type { Chain } from "../src/types";
export default {
  "chain": "Eter",
  "chainId": 140,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeibexfskndvhn5xtrcmpjoifp2ufnzgwiwbfrjcxat55alergskkve",
    "width": 122,
    "height": 133,
    "format": "svg"
  },
  "infoURL": "https://eternalcoin.io",
  "name": "Eternal Mainnet",
  "nativeCurrency": {
    "name": "Eternal",
    "symbol": "Eter",
    "decimals": 18
  },
  "networkId": 140,
  "rpc": [
    "https://140.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.eternalcoin.io/v1",
    "ws://mainnet.eternalcoin.io/v1/ws"
  ],
  "shortName": "Eter",
  "slug": "eternal",
  "testnet": false
} as const satisfies Chain;