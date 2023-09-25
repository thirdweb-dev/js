import type { Chain } from "../src/types";
export default {
  "chainId": 943,
  "chain": "t4PLS",
  "name": "PulseChain Testnet v4",
  "rpc": [
    "https://pulsechain-testnet-v4.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.v4.testnet.pulsechain.com",
    "wss://rpc.v4.testnet.pulsechain.com",
    "https://pulsechain-testnet.publicnode.com",
    "wss://pulsechain-testnet.publicnode.com",
    "https://rpc-testnet-pulsechain.g4mm4.io",
    "wss://rpc-testnet-pulsechain.g4mm4.io"
  ],
  "slug": "pulsechain-testnet-v4",
  "icon": {
    "url": "ipfs://Qmckj9B9F3jWDk9bv9HwoPmfjrx2Ju8J2BQSNoPFdYGduj",
    "width": 433,
    "height": 402,
    "format": "png"
  },
  "faucets": [
    "https://faucet.v4.testnet.pulsechain.com/"
  ],
  "nativeCurrency": {
    "name": "Test Pulse",
    "symbol": "tPLS",
    "decimals": 18
  },
  "infoURL": "https://pulsechain.com",
  "shortName": "t4pls",
  "testnet": true,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://otter-testnet-pulsechain.g4mm4.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;