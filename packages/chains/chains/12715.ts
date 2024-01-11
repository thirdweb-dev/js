import type { Chain } from "../src/types";
export default {
  "chain": "Rikeza",
  "chainId": 12715,
  "explorers": [
    {
      "name": "Rikeza Blockchain explorer",
      "url": "https://testnet.rikscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfJ1Qxpzi6CSLeFeWY1Bwe435CpT5za5WfrLUE7vNzZfy",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://rikeza.io",
  "name": "Rikeza Network Testnet",
  "nativeCurrency": {
    "name": "Rikeza",
    "symbol": "RIK",
    "decimals": 18
  },
  "networkId": 12715,
  "rpc": [
    "https://rikeza-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://12715.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.rikscan.com"
  ],
  "shortName": "tRIK",
  "slip44": 1,
  "slug": "rikeza-network-testnet",
  "testnet": true,
  "title": "Rikeza Network Testnet"
} as const satisfies Chain;