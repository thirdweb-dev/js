import type { Chain } from "../src/types";
export default {
  "chain": "LATEST",
  "chainId": 6660,
  "explorers": [
    {
      "name": "Latest Chain",
      "url": "http://testnet.latestchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://faucet.latestchain.io"
  ],
  "icon": {
    "url": "ipfs://QmUU784i1ZHDNwgXvt9weZmq6YbHHkyXvuDS7r4iDzao72",
    "width": 1115,
    "height": 1242,
    "format": "png"
  },
  "infoURL": "https://latestcoin.io",
  "name": "Latest Chain Testnet",
  "nativeCurrency": {
    "name": "Latest",
    "symbol": "LATEST",
    "decimals": 18
  },
  "networkId": 6660,
  "rpc": [
    "https://latest-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6660.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.latestcoin.io"
  ],
  "shortName": "LATESTt",
  "slug": "latest-chain-testnet",
  "testnet": true
} as const satisfies Chain;