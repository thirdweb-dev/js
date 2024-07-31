import type { Chain } from "../src/types";
export default {
  "chain": "LPC",
  "chainId": 175177,
  "explorers": [
    {
      "name": "Lit Chronicle Explorer",
      "url": "https://chain.litprotocol.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmXZcwET1LhUxfc2mCdiCJFm61jUHsVVXuZYwx8zhvHQxn",
        "width": 164,
        "height": 164,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.litprotocol.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmXZcwET1LhUxfc2mCdiCJFm61jUHsVVXuZYwx8zhvHQxn",
    "width": 164,
    "height": 164,
    "format": "png"
  },
  "infoURL": "https://developer.litprotocol.com/v3/network/rollup",
  "name": "Chronicle - Lit Protocol Testnet",
  "nativeCurrency": {
    "name": "Test LIT",
    "symbol": "tstLIT",
    "decimals": 18
  },
  "networkId": 175177,
  "redFlags": [],
  "rpc": [
    "https://175177.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.litprotocol.com/http"
  ],
  "shortName": "lpc",
  "slug": "chronicle-lit-protocol-testnet",
  "testnet": true
} as const satisfies Chain;