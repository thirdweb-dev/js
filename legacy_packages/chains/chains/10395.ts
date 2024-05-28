import type { Chain } from "../src/types";
export default {
  "chain": "Worldland",
  "chainId": 10395,
  "explorers": [
    {
      "name": "Worldland Explorer",
      "url": "https://testscan.worldland.foundation",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://worldland.foundation",
  "name": "WorldLand Testnet",
  "nativeCurrency": {
    "name": "Worldland",
    "symbol": "WLC",
    "decimals": 18
  },
  "networkId": 10395,
  "rpc": [
    "https://10395.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gwangju.worldland.foundation"
  ],
  "shortName": "TWLC",
  "slip44": 1,
  "slug": "worldland-testnet",
  "testnet": true
} as const satisfies Chain;