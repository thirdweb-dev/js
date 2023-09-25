import type { Chain } from "../src/types";
export default {
  "chainId": 401,
  "chain": "OZONE",
  "name": "Ozone Chain Testnet",
  "rpc": [
    "https://ozone-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.testnet.ozonechain.io"
  ],
  "slug": "ozone-chain-testnet",
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
  "shortName": "ozo_tst",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "OZONE Scan",
      "url": "https://testnet.ozonescan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;