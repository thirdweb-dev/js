import type { Chain } from "../src/types";
export default {
  "chain": "KNB",
  "chainId": 13600,
  "explorers": [
    {
      "name": "qbitscan",
      "url": "https://explorer.qbitscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmZEuR4bJaZkC497qQnsxHv23pZFcXb9dTdaDPCPo2sj9Z",
        "width": 200,
        "height": 200,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZEuR4bJaZkC497qQnsxHv23pZFcXb9dTdaDPCPo2sj9Z",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://kronobit.org",
  "name": "Kronobit Mainnet",
  "nativeCurrency": {
    "name": "Kronobit",
    "symbol": "KNB",
    "decimals": 18
  },
  "networkId": 13600,
  "rpc": [
    "https://13600.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.qbitscan.com"
  ],
  "shortName": "KNB",
  "slug": "kronobit",
  "testnet": false,
  "title": "Kronobit Mainnet"
} as const satisfies Chain;