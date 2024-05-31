import type { Chain } from "../src/types";
export default {
  "chain": "Poodl",
  "chainId": 15259,
  "explorers": [
    {
      "name": "Poodl Mainnet Explorer",
      "url": "https://explorer.poodl.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXfBFHHb5kJGQ3dMLnhDhfFBsgAvm9U72jBSYcfmRHL2p",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://poodl.org",
  "name": "Poodl Mainnet",
  "nativeCurrency": {
    "name": "Poodl",
    "symbol": "POODL",
    "decimals": 18
  },
  "networkId": 15259,
  "rpc": [
    "https://15259.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.poodl.org"
  ],
  "shortName": "poodle",
  "slug": "poodl",
  "testnet": false
} as const satisfies Chain;