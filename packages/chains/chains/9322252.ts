import type { Chain } from "../src/types";
export default {
  "chain": "XCAP",
  "chainId": 9322252,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://xcap-mainnet.explorer.xcap.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeTj6tfaw9qf9wnEUQh7PnCpNWyvm56e7kY35kANRWNxj",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "infoURL": "https://xcap.network/",
  "name": "XCAP",
  "nativeCurrency": {
    "name": "Gas",
    "symbol": "GAS",
    "decimals": 18
  },
  "networkId": 9322252,
  "rpc": [
    "https://9322252.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://xcap-mainnet.relay.xcap.network/znzvh2ueyvm2yts5fv5gnul395jbkfb2/rpc1"
  ],
  "shortName": "xcap",
  "slug": "xcap",
  "testnet": false,
  "title": "XCAP Mainnet"
} as const satisfies Chain;