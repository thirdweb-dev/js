import type { Chain } from "../src/types";
export default {
  "name": "CamDL Mainnet",
  "chain": "CADL",
  "rpc": [
    "https://camdl.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.camdl.gov.kh/"
  ],
  "faucets": [
    "https://faucet.camdl.gov.kh/"
  ],
  "nativeCurrency": {
    "name": "CADL",
    "symbol": "CADL",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://camdl.gov.kh/",
  "shortName": "camdl",
  "chainId": 95,
  "networkId": 95,
  "redFlags": [
    "reusedChainId"
  ],
  "icon": "camdl",
  "explorers": [
    {
      "name": "CamDL Block Explorer",
      "url": "https://explorer.camdl.gov.kh",
      "standard": "EIP3091"
    }
  ],
  "status": "active",
  "testnet": false,
  "slug": "camdl"
} as const satisfies Chain;