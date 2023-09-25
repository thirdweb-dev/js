import type { Chain } from "../src/types";
export default {
  "chainId": 12715,
  "chain": "Rikeza",
  "name": "Rikeza Network Testnet",
  "rpc": [
    "https://rikeza-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.rikscan.com"
  ],
  "slug": "rikeza-network-testnet",
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
  "shortName": "tRIK",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Rikeza Blockchain explorer",
      "url": "https://testnet.rikscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;