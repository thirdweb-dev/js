import type { Chain } from "../src/types";
export default {
  "chain": "ICB",
  "chainId": 73115,
  "explorers": [
    {
      "name": "ICB Explorer",
      "url": "https://icbscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreifgpv7tnai42hsdegnpwzbvq5iymgub357e553cotitirwy2ir7je",
    "width": 2000,
    "height": 2243,
    "format": "png"
  },
  "infoURL": "https://icb.network",
  "name": "ICB Network",
  "nativeCurrency": {
    "name": "ICB Native Token",
    "symbol": "ICBX",
    "decimals": 18
  },
  "networkId": 73115,
  "rpc": [
    "https://73115.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1-mainnet.icbnetwork.info/",
    "https://rpc2-mainnet.icbnetwork.info/"
  ],
  "shortName": "ICBX",
  "slug": "icb-network",
  "testnet": false
} as const satisfies Chain;