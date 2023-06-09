import type { Chain } from "../src/types";
export default {
  "name": "Ozone Chain Mainnet",
  "chain": "OZONE",
  "rpc": [
    "https://ozone-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.ozonechain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OZONE",
    "symbol": "OZO",
    "decimals": 18
  },
  "infoURL": "https://ozonechain.io",
  "shortName": "ozo",
  "chainId": 4000,
  "networkId": 4000,
  "icon": {
    "url": "ipfs://QmbM4weV8Bk6c9yNhosYntkVw39SNZtCHYGgWyXTxkevZ8",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "explorers": [
    {
      "name": "OZONE Scan",
      "url": "https://ozonescan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ozone-chain"
} as const satisfies Chain;