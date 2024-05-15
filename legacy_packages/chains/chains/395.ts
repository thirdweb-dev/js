import type { Chain } from "../src/types";
export default {
  "chain": "CADL",
  "chainId": 395,
  "explorers": [
    {
      "name": "CamDL Testnet Explorer",
      "url": "https://explorer.testnet.camdl.gov.kh",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.testnet.camdl.gov.kh/"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmW5Fpb2Ywnfqcj4ibvpbKvPv5Mo5eseWdYZnnUvLkj2Hp",
    "width": 1453,
    "height": 1453,
    "format": "png"
  },
  "infoURL": "https://camdl.gov.kh/",
  "name": "CamDL Testnet",
  "nativeCurrency": {
    "name": "CADL",
    "symbol": "CADL",
    "decimals": 18
  },
  "networkId": 395,
  "rpc": [
    "https://395.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.testnet.camdl.gov.kh/"
  ],
  "shortName": "camdl-testnet",
  "slug": "camdl-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;