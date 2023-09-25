import type { Chain } from "../src/types";
export default {
  "chainId": 79,
  "chain": "Zenith",
  "name": "Zenith Mainnet",
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
  "slug": "zenith",
  "faucets": [],
  "nativeCurrency": {
    "name": "ZENITH",
    "symbol": "ZENITH",
    "decimals": 18
  },
  "infoURL": "https://www.zenithchain.co/",
  "shortName": "zenith",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "zenith scan",
      "url": "https://scan.zenithchain.co",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;