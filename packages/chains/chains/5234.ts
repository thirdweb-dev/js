import type { Chain } from "../src/types";
export default {
  "name": "Humanode Mainnet",
  "chain": "HMND",
  "rpc": [
    "https://humanode.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://explorer-rpc-http.mainnet.stages.humanode.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "eHMND",
    "symbol": "eHMND",
    "decimals": 18
  },
  "infoURL": "https://humanode.io",
  "shortName": "hmnd",
  "chainId": 5234,
  "networkId": 5234,
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
  "testnet": false,
  "slug": "humanode"
} as const satisfies Chain;