import type { Chain } from "../src/types";
export default {
  "chain": "XCAP",
  "chainId": 9322253,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://xcap-milvine.explorer.xcap.network",
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
  "name": "Milvine",
  "nativeCurrency": {
    "name": "Gas",
    "symbol": "GAS",
    "decimals": 18
  },
  "networkId": 9322253,
  "rpc": [
    "https://milvine.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9322253.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://xcap-milvine.relay.xcap.network/zj5l55ftsgi027kz4nf14vs8d89inego/rpc1"
  ],
  "shortName": "milv",
  "slug": "milvine",
  "testnet": true,
  "title": "XCAP Testnet Milvine"
} as const satisfies Chain;