import type { Chain } from "../src/types";
export default {
  "chainId": 95,
  "chain": "CADL",
  "name": "CamDL Mainnet",
  "rpc": [
    "https://camdl.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.camdl.gov.kh/"
  ],
  "slug": "camdl",
  "icon": {
    "url": "ipfs://QmW5Fpb2Ywnfqcj4ibvpbKvPv5Mo5eseWdYZnnUvLkj2Hp",
    "width": 1453,
    "height": 1453,
    "format": "png"
  },
  "faucets": [
    "https://faucet.camdl.gov.kh/"
  ],
  "nativeCurrency": {
    "name": "CADL",
    "symbol": "CADL",
    "decimals": 18
  },
  "infoURL": "https://camdl.gov.kh/",
  "shortName": "camdl",
  "testnet": false,
  "status": "active",
  "redFlags": [
    "reusedChainId"
  ],
  "explorers": [
    {
      "name": "CamDL Block Explorer",
      "url": "https://explorer.camdl.gov.kh",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ]
} as const satisfies Chain;