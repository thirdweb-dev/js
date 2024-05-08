import type { Chain } from "../src/types";
export default {
  "chain": "One World Chain",
  "chainId": 552981,
  "explorers": [
    {
      "name": "One World Chain Testnet Explorer",
      "url": "https://testnet.oneworldchain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.oneworldchain.org"
  ],
  "icon": {
    "url": "ipfs://QmPmZ6vgtdMG7jttVZQUobF96Sva1noi5Fsi28V1Eck6eC",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://oneworldchain.org",
  "name": "One World Chain Testnet",
  "nativeCurrency": {
    "name": "OWCT",
    "symbol": "OWCT",
    "decimals": 18
  },
  "networkId": 552981,
  "rpc": [
    "https://552981.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.oneworldchain.org"
  ],
  "shortName": "OWCTt",
  "slug": "one-world-chain-testnet",
  "testnet": true
} as const satisfies Chain;