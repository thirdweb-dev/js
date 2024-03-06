import type { Chain } from "../src/types";
export default {
  "chain": "Kalichain",
  "chainId": 653,
  "explorers": [
    {
      "name": "kalichain explorer",
      "url": "https://explorer.kalichain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreieox7v337p3jfhd37dz74mq6mn3uk5i5475rmzpirmyp6ydcfzzqi",
    "width": 350,
    "height": 350,
    "format": "png"
  },
  "infoURL": "https://kalichain.com",
  "name": "Kalichain Testnet",
  "nativeCurrency": {
    "name": "kalis",
    "symbol": "KALIS",
    "decimals": 18
  },
  "networkId": 653,
  "rpc": [
    "https://653.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kalichain.com"
  ],
  "shortName": "kalichain",
  "slug": "kalichain-testnet",
  "testnet": true
} as const satisfies Chain;