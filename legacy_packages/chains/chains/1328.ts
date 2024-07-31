import type { Chain } from "../src/types";
export default {
  "chain": "Sei",
  "chainId": 1328,
  "explorers": [
    {
      "name": "Seitrace",
      "url": "https://seitrace.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://atlantic-2.app.sei.io/faucet"
  ],
  "icon": {
    "url": "ipfs://bafkreih3l3iisplmikofkbfyimqlox7nmixzlkzhjoewmpi4jbqitwryoa",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://www.sei.io",
  "name": "Sei Testnet",
  "nativeCurrency": {
    "name": "Sei",
    "symbol": "SEI",
    "decimals": 18
  },
  "networkId": 1328,
  "rpc": [
    "https://1328.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc-testnet.sei-apis.com",
    "wss://evm-ws-testnet.sei-apis.com"
  ],
  "shortName": "sei-testnet",
  "slug": "sei-testnet",
  "testnet": true
} as const satisfies Chain;