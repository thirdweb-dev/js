import type { Chain } from "../src/types";
export default {
  "name": "Ozone Chain Testnet",
  "chain": "OZONE",
  "rpc": [
    "https://ozone-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.testnet.ozonechain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OZONE",
    "symbol": "OZO",
    "decimals": 18
  },
  "infoURL": "https://ozonechain.io",
  "shortName": "ozo_tst",
  "chainId": 401,
  "networkId": 401,
  "icon": {
    "url": "ipfs://QmbM4weV8Bk6c9yNhosYntkVw39SNZtCHYGgWyXTxkevZ8",
    "width": 1600,
    "height": 1600,
    "format": "png"
  },
  "explorers": [
    {
      "name": "OZONE Scan",
      "url": "https://testnet.ozonescan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "ozone-chain-testnet"
} as const satisfies Chain;