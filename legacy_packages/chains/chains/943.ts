import type { Chain } from "../src/types";
export default {
  "chain": "t4PLS",
  "chainId": 943,
  "ens": {
    "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://otter-testnet-pulsechain.g4mm4.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.v4.testnet.pulsechain.com/"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://Qmckj9B9F3jWDk9bv9HwoPmfjrx2Ju8J2BQSNoPFdYGduj",
    "width": 433,
    "height": 402,
    "format": "png"
  },
  "infoURL": "https://pulsechain.com",
  "name": "PulseChain Testnet v4",
  "nativeCurrency": {
    "name": "Test Pulse",
    "symbol": "tPLS",
    "decimals": 18
  },
  "networkId": 943,
  "rpc": [
    "https://943.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.v4.testnet.pulsechain.com",
    "wss://rpc.v4.testnet.pulsechain.com",
    "https://pulsechain-testnet-rpc.publicnode.com",
    "wss://pulsechain-testnet-rpc.publicnode.com",
    "https://rpc-testnet-pulsechain.g4mm4.io",
    "wss://rpc-testnet-pulsechain.g4mm4.io"
  ],
  "shortName": "t4pls",
  "slip44": 1,
  "slug": "pulsechain-testnet-v4",
  "status": "active",
  "testnet": true
} as const satisfies Chain;