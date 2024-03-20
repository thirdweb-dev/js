import type { Chain } from "../src/types";
export default {
  "chain": "Sei",
  "chainId": 713715,
  "explorers": [
    {
      "name": "Seistream",
      "url": "https://seistream.app",
      "standard": "none"
    },
    {
      "name": "Seitrace",
      "url": "https://seitrace.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://sei-faucet.nima.enterprises",
    "https://sei-evm.faucetme.pro"
  ],
  "icon": {
    "url": "ipfs://bafkreih3l3iisplmikofkbfyimqlox7nmixzlkzhjoewmpi4jbqitwryoa",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://www.sei.io",
  "name": "Sei Devnet",
  "nativeCurrency": {
    "name": "Sei",
    "symbol": "SEI",
    "decimals": 18
  },
  "networkId": 713715,
  "rpc": [
    "https://713715.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc-arctic-1.sei-apis.com",
    "https://evm-rpc.arctic-1.seinetwork.io"
  ],
  "shortName": "sei-devnet",
  "slug": "sei-devnet",
  "testnet": false
} as const satisfies Chain;