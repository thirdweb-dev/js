import type { Chain } from "../src/types";
export default {
  "chain": "CPV",
  "chainId": 6779,
  "explorers": [
    {
      "name": "cpvscan",
      "url": "https://scan.compverse.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYbskrGpidbMwsJekTeLrr8Z6GA9q4Uxh7piS1F9BdWWv",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://compverse.io",
  "name": "Compverse Mainnet",
  "nativeCurrency": {
    "name": "compverse",
    "symbol": "CPV",
    "decimals": 18
  },
  "networkId": 6779,
  "rpc": [
    "https://compverse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6779.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.compverse.io/",
    "https://rpc-useast1.compverse.io/"
  ],
  "shortName": "compverse",
  "slip44": 7779,
  "slug": "compverse",
  "testnet": false
} as const satisfies Chain;