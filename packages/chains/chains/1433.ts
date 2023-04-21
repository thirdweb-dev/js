import type { Chain } from "../src/types";
export default {
  "name": "Rikeza Network Mainnet",
  "title": "Rikeza Network Mainnet",
  "chain": "Rikeza",
  "icon": {
    "url": "ipfs://QmfJ1Qxpzi6CSLeFeWY1Bwe435CpT5za5WfrLUE7vNzZfy",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://rikeza-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.rikscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rikeza",
    "symbol": "RIK",
    "decimals": 18
  },
  "infoURL": "https://rikeza.io",
  "shortName": "RIK",
  "chainId": 1433,
  "networkId": 1433,
  "explorers": [
    {
      "name": "Rikeza Blockchain explorer",
      "url": "https://rikscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "rikeza-network"
} as const satisfies Chain;