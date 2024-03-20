import type { Chain } from "../src/types";
export default {
  "chain": "Runic",
  "chainId": 822,
  "explorers": [
    {
      "name": "RunicScan",
      "url": "https://scan.runic.build",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmW3RZKwBq12F7jVV2pn6T9WzwU5rosLYkVqoRQckfKvXo",
        "width": 340,
        "height": 340,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.runic.build"
  ],
  "icon": {
    "url": "ipfs://QmW3RZKwBq12F7jVV2pn6T9WzwU5rosLYkVqoRQckfKvXo",
    "width": 340,
    "height": 340,
    "format": "png"
  },
  "infoURL": "https://runic.build",
  "name": "Runic Chain Testnet",
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "rBTC",
    "decimals": 18
  },
  "networkId": 822,
  "rpc": [
    "https://822.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.runic.build"
  ],
  "shortName": "runic-testnet",
  "slug": "runic-chain-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;