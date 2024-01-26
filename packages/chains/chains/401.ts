import type { Chain } from "../src/types";
export default {
  "chain": "OZONE",
  "chainId": 401,
  "explorers": [
    {
      "name": "OZONE Scan",
      "url": "https://testnet.ozonescan.io",
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
  "name": "Ozone Chain Testnet",
  "nativeCurrency": {
    "name": "OZONE",
    "symbol": "OZO",
    "decimals": 18
  },
  "networkId": 401,
  "rpc": [
    "https://ozone-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://401.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.testnet.ozonechain.io"
  ],
  "shortName": "ozo_tst",
  "slip44": 1,
  "slug": "ozone-chain-testnet",
  "testnet": true
} as const satisfies Chain;