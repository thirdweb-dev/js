import type { Chain } from "../src/types";
export default {
  "chain": "Rikeza",
  "chainId": 1433,
  "explorers": [
    {
      "name": "Rikeza Blockchain explorer",
      "url": "https://rikscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmfJ1Qxpzi6CSLeFeWY1Bwe435CpT5za5WfrLUE7vNzZfy",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://rikeza.io",
  "name": "Rikeza Network Mainnet",
  "nativeCurrency": {
    "name": "Rikeza",
    "symbol": "RIK",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://rikeza-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rikscan.com"
  ],
  "shortName": "RIK",
  "slug": "rikeza-network",
  "testnet": false
} as const satisfies Chain;