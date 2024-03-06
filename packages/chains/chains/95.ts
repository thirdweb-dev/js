import type { Chain } from "../src/types";
export default {
  "chain": "CADL",
  "chainId": 95,
  "explorers": [
    {
      "name": "CamDL Block Explorer",
      "url": "https://explorer.camdl.gov.kh",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.camdl.gov.kh/"
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
  "name": "CamDL Mainnet",
  "nativeCurrency": {
    "name": "CADL",
    "symbol": "CADL",
    "decimals": 18
  },
  "networkId": 95,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://95.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.camdl.gov.kh/"
  ],
  "shortName": "camdl",
  "slug": "camdl",
  "status": "active",
  "testnet": false
} as const satisfies Chain;