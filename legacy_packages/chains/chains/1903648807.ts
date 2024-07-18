import type { Chain } from "../src/types";
export default {
  "chain": "Gemuchain",
  "chainId": 1903648807,
  "explorers": [
    {
      "name": "Gemuchain Explorer (Blockscout)",
      "url": "https://gemutest-explorer.gemuchain.io",
      "standard": "EIP3091"
    },
    {
      "name": "blockscout",
      "url": "https://gemutest-explorer.gemuchain.io/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.gemuchain.io/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmSw7QvgrkuykN1ZTr2QQZZjuxbx9CsZDuuTD1cv1hQo8G",
    "width": 84,
    "height": 84,
    "format": "png"
  },
  "infoURL": "https://gemuchain.io/",
  "name": "Gemuchain Testnet",
  "nativeCurrency": {
    "name": "GEMU",
    "symbol": "GEMU",
    "decimals": 18
  },
  "networkId": 1903648807,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://gemutest-bridge.gemuchain.io/login"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://1903648807.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gemutest-rpc.gemuchain.io/",
    "https://gemutest-rpc.gemuchain.io"
  ],
  "shortName": "GEMU",
  "slug": "gemuchain-testnet",
  "testnet": true
} as const satisfies Chain;