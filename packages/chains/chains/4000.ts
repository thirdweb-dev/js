import type { Chain } from "../src/types";
export default {
  "chain": "OZONE",
  "chainId": 4000,
  "explorers": [
    {
      "name": "OZONE Scan",
      "url": "https://ozonescan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmbM4weV8Bk6c9yNhosYntkVw39SNZtCHYGgWyXTxkevZ8",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "infoURL": "https://ozonechain.io",
  "name": "Ozone Chain Mainnet",
  "nativeCurrency": {
    "name": "OZONE",
    "symbol": "OZO",
    "decimals": 18
  },
  "networkId": 4000,
  "rpc": [
    "https://ozone-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.ozonechain.io"
  ],
  "shortName": "ozo",
  "slug": "ozone-chain",
  "testnet": false
} as const satisfies Chain;