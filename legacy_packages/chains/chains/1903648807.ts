import type { Chain } from "../src/types";
export default {
  "chain": "Gemuchain",
  "chainId": 1903648807,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://gemutest-explorer.gemuchain.io/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmSw7QvgrkuykN1ZTr2QQZZjuxbx9CsZDuuTD1cv1hQo8G",
    "width": 84,
    "height": 84,
    "format": "png"
  },
  "name": "Gemuchain Testnet",
  "nativeCurrency": {
    "name": "GEMU",
    "symbol": "GEMU",
    "decimals": 18
  },
  "networkId": 1903648807,
  "redFlags": [],
  "rpc": [
    "https://1903648807.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gemutest-rpc.gemuchain.io/"
  ],
  "shortName": "GEMU",
  "slug": "gemuchain-testnet",
  "testnet": true
} as const satisfies Chain;