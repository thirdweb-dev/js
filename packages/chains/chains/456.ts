import type { Chain } from "../src/types";
export default {
  "chain": "ARZIO",
  "chainId": 456,
  "explorers": [
    {
      "name": "ARZIO Scan",
      "url": "https://scan.arzio.co",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmUwqGWGjjQweTprn5LBirAwRjYnteTiFLCVpSNHrfMmSL",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "infoURL": "https://chain.arzio.co",
  "name": "ARZIO Chain",
  "nativeCurrency": {
    "name": "ARZIO",
    "symbol": "AZO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://arzio-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.arzio.co"
  ],
  "shortName": "arzio",
  "slug": "arzio-chain",
  "testnet": false
} as const satisfies Chain;