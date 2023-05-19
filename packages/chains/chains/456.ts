import type { Chain } from "../src/types";
export default {
  "name": "ARZIO Chain",
  "chain": "ARZIO",
  "icon": {
    "url": "ipfs://QmUwqGWGjjQweTprn5LBirAwRjYnteTiFLCVpSNHrfMmSL",
    "width": 150,
    "height": 150,
    "format": "png"
  },
  "rpc": [
    "https://arzio-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.arzio.co"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ARZIO",
    "symbol": "AZO",
    "decimals": 18
  },
  "infoURL": "https://chain.arzio.co",
  "shortName": "arzio",
  "chainId": 456,
  "networkId": 456,
  "explorers": [
    {
      "name": "ARZIO Scan",
      "url": "https://scan.arzio.co",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "arzio-chain"
} as const satisfies Chain;