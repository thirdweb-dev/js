import type { Chain } from "../src/types";
export default {
  "chain": "HMND",
  "chainId": 5234,
  "explorers": [
    {
      "name": "Subscan",
      "url": "https://humanode.subscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://Qma2GfW5nQHuA7nGqdEfwaXPL63G9oTwRTQKaGTfjNtM2W",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "infoURL": "https://humanode.io",
  "name": "Humanode Mainnet",
  "nativeCurrency": {
    "name": "eHMND",
    "symbol": "eHMND",
    "decimals": 18
  },
  "networkId": 5234,
  "rpc": [
    "https://humanode.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5234.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://explorer-rpc-http.mainnet.stages.humanode.io"
  ],
  "shortName": "hmnd",
  "slug": "humanode",
  "testnet": false
} as const satisfies Chain;