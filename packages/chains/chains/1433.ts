import type { Chain } from "../src/types";
export default {
  "chainId": 1433,
  "chain": "Rikeza",
  "name": "Rikeza Network Mainnet",
  "rpc": [
    "https://rikeza-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rikscan.com"
  ],
  "slug": "rikeza-network",
  "icon": {
    "url": "ipfs://QmfJ1Qxpzi6CSLeFeWY1Bwe435CpT5za5WfrLUE7vNzZfy",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Rikeza",
    "symbol": "RIK",
    "decimals": 18
  },
  "infoURL": "https://rikeza.io",
  "shortName": "RIK",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Rikeza Blockchain explorer",
      "url": "https://rikscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;