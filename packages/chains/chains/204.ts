import type { Chain } from "../src/types";
export default {
  "chain": "opBNB",
  "chainId": 204,
  "explorers": [
    {
      "name": "opbnbscan",
      "url": "https://mainnet.opbnbscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeib75gwytvblyvjpfminitr3i6mpat3a624udfsqsl5nysf5vuuvie",
    "width": 96,
    "height": 96,
    "format": "png"
  },
  "infoURL": "https://opbnb.bnbchain.org/en",
  "name": "opBNB Mainnet",
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "networkId": 204,
  "rpc": [
    "https://204.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://opbnb-mainnet-rpc.bnbchain.org",
    "https://opbnb-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
    "wss://opbnb-mainnet.nodereal.io/ws/v1/64a9df0874fb4a93b9d0a3849de012d3",
    "https://opbnb-mainnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
    "wss://opbnb-mainnet.nodereal.io/ws/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
    "https://opbnb-rpc.publicnode.com",
    "wss://opbnb-rpc.publicnode.com"
  ],
  "shortName": "obnb",
  "slip44": 714,
  "slug": "opbnb",
  "testnet": false
} as const satisfies Chain;