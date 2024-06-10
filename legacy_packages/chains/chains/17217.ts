import type { Chain } from "../src/types";
export default {
  "chain": "KONET",
  "chainId": 17217,
  "explorers": [
    {
      "name": "konet-explorer",
      "url": "https://explorer.kon-wallet.com",
      "standard": "EIP3091"
    },
    {
      "name": "Konetscan",
      "url": "https://konetexplorer.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmSszu2AhLPgcp8SZYiBYCQiRVwb9ueqbnGbcTx9H9CJjZ",
    "width": 1851,
    "height": 1851,
    "format": "png"
  },
  "infoURL": "https://konetmain.com",
  "name": "KONET Mainnet",
  "nativeCurrency": {
    "name": "KONET",
    "symbol": "KONET",
    "decimals": 18
  },
  "networkId": 17217,
  "redFlags": [],
  "rpc": [
    "https://17217.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.kon-wallet.com"
  ],
  "shortName": "KONET",
  "slip44": 1,
  "slug": "konet",
  "testnet": false
} as const satisfies Chain;