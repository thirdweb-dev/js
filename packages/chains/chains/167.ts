import type { Chain } from "../src/types";
export default {
  "chainId": 167,
  "chain": "ATOSHI",
  "name": "Atoshi Testnet",
  "rpc": [
    "https://atoshi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.atoshi.io/"
  ],
  "slug": "atoshi-testnet",
  "icon": {
    "url": "ipfs://QmfFK6B4MFLrpSS46aLf7hjpt28poHFeTGEKEuH248Tbyj",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "ATOSHI",
    "symbol": "ATOS",
    "decimals": 18
  },
  "infoURL": "https://atoshi.org",
  "shortName": "atoshi",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "atoshiscan",
      "url": "https://scan.atoverse.info",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;