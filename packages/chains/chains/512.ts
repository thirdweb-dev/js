import type { Chain } from "../src/types";
export default {
  "chain": "AAC",
  "chainId": 512,
  "explorers": [
    {
      "name": "aacscan",
      "url": "https://scan.acuteangle.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRUrz4dULaoaMpnqd8qXT7ehwz3aaqnYKY4ePsy7isGaF",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.acuteangle.com/",
  "name": "Double-A Chain Mainnet",
  "nativeCurrency": {
    "name": "Acuteangle Native Token",
    "symbol": "AAC",
    "decimals": 18
  },
  "networkId": 512,
  "rpc": [
    "https://512.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.acuteangle.com"
  ],
  "shortName": "aac",
  "slip44": 1512,
  "slug": "double-a-chain",
  "testnet": false
} as const satisfies Chain;