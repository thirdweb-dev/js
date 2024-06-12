import type { Chain } from "../src/types";
export default {
  "chain": "Sei",
  "chainId": 1329,
  "explorers": [
    {
      "name": "Seitrace",
      "url": "https://seitrace.com",
      "standard": "EIP3091"
    },
    {
      "name": "Sei Explorer",
      "url": "https://github.com/sei-protocol/sei-chain/blob/main/assets/SeiLogo.png",
      "standard": "EIP3091",
      "icon": {
        "url": "https://github.com/sei-protocol/sei-chain/blob/main/assets/SeiLogo.png",
        "width": 231,
        "height": 231,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://github.com/sei-protocol/sei-chain/blob/main/assets/SeiLogo.png",
    "width": 231,
    "height": 231,
    "format": "png"
  },
  "infoURL": "https://www.sei.io",
  "name": "Sei",
  "nativeCurrency": {
    "name": "Sei",
    "symbol": "Sei",
    "decimals": 18
  },
  "networkId": 1329,
  "redFlags": [],
  "rpc": [
    "https://1329.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.sei-apis.com",
    "wss://evm-ws.sei-apis.com"
  ],
  "shortName": "sei",
  "slug": "sei",
  "testnet": false
} as const satisfies Chain;