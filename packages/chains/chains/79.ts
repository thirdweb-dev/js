import type { Chain } from "../src/types";
export default {
  "chain": "Zenith",
  "chainId": 79,
  "explorers": [
    {
      "name": "zenith scan",
      "url": "https://scan.zenithchain.co",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.zenithchain.co/",
  "name": "Zenith Mainnet",
  "nativeCurrency": {
    "name": "ZENITH",
    "symbol": "ZENITH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://zenith.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataserver-us-1.zenithchain.co/",
    "https://dataserver-asia-3.zenithchain.co/",
    "https://dataserver-asia-4.zenithchain.co/",
    "https://dataserver-asia-2.zenithchain.co/",
    "https://dataserver-asia-5.zenithchain.co/",
    "https://dataserver-asia-6.zenithchain.co/",
    "https://dataserver-asia-7.zenithchain.co/"
  ],
  "shortName": "zenith",
  "slug": "zenith",
  "testnet": false
} as const satisfies Chain;