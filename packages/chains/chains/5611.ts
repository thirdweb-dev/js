import type { Chain } from "../src/types";
export default {
  "chain": "opBNB",
  "chainId": 5611,
  "explorers": [
    {
      "name": "bscscan-opbnb-testnet",
      "url": "https://opbnb-testnet.bscscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "opbnbscan",
      "url": "https://opbnbscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://testnet.bnbchain.org/faucet-smart"
  ],
  "icon": {
    "url": "ipfs://bafybeib75gwytvblyvjpfminitr3i6mpat3a624udfsqsl5nysf5vuuvie",
    "width": 96,
    "height": 96,
    "format": "png"
  },
  "infoURL": "https://opbnb.bnbchain.org/en",
  "name": "opBNB Testnet",
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "tBNB",
    "decimals": 18
  },
  "networkId": 5611,
  "rpc": [
    "https://opbnb-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5611.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://opbnb-testnet-rpc.bnbchain.org",
    "https://opbnb-testnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
    "wss://opbnb-testnet.nodereal.io/ws/v1/64a9df0874fb4a93b9d0a3849de012d3",
    "https://opbnb-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
    "wss://opbnb-testnet.nodereal.io/ws/v1/e9a36765eb8a40b9bd12e680a1fd2bc5"
  ],
  "shortName": "obnbt",
  "slip44": 1,
  "slug": "opbnb-testnet",
  "testnet": true
} as const satisfies Chain;