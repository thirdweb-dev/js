import type { Chain } from "../src/types";
export default {
  "chain": "KYOTO",
  "chainId": 1998,
  "explorers": [
    {
      "name": "Kyotoscan",
      "url": "https://testnet.kyotoscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.kyotoprotocol.io"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://kyotoprotocol.io",
  "name": "Kyoto Testnet",
  "nativeCurrency": {
    "name": "Kyoto",
    "symbol": "KYOTO",
    "decimals": 18
  },
  "networkId": 1998,
  "rpc": [
    "https://kyoto-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1998.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.kyotoprotocol.io:8545"
  ],
  "shortName": "kyoto-testnet",
  "slip44": 1,
  "slug": "kyoto-testnet",
  "testnet": true
} as const satisfies Chain;