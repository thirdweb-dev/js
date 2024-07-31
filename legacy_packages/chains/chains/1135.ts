import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1135,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.lisk.com",
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
    "url": "ipfs://QmVTS8jmWD5e7jVEn86wLjJsuMnc6s8fym3JbtE4etzSKf",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://lisk.com",
  "name": "Lisk",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1135,
  "rpc": [
    "https://1135.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.api.lisk.com"
  ],
  "shortName": "lisk",
  "slip44": 134,
  "slug": "lisk",
  "testnet": false
} as const satisfies Chain;