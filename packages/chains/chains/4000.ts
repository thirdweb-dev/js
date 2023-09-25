import type { Chain } from "../src/types";
export default {
  "chainId": 4000,
  "chain": "OZONE",
  "name": "Ozone Chain Mainnet",
  "rpc": [
    "https://ozone-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.ozonechain.io"
  ],
  "slug": "ozone-chain",
  "icon": {
    "url": "ipfs://QmbM4weV8Bk6c9yNhosYntkVw39SNZtCHYGgWyXTxkevZ8",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "OZONE",
    "symbol": "OZO",
    "decimals": 18
  },
  "infoURL": "https://ozonechain.io",
  "shortName": "ozo",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "OZONE Scan",
      "url": "https://ozonescan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;