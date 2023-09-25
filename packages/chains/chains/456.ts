import type { Chain } from "../src/types";
export default {
  "chainId": 456,
  "chain": "ARZIO",
  "name": "ARZIO Chain",
  "rpc": [
    "https://arzio-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.arzio.co"
  ],
  "slug": "arzio-chain",
  "icon": {
    "url": "ipfs://QmUwqGWGjjQweTprn5LBirAwRjYnteTiFLCVpSNHrfMmSL",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "ARZIO",
    "symbol": "AZO",
    "decimals": 18
  },
  "infoURL": "https://chain.arzio.co",
  "shortName": "arzio",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ARZIO Scan",
      "url": "https://scan.arzio.co",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;