import type { Chain } from "../src/types";
export default {
  "chain": "IOTA EVM",
  "chainId": 1075,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.evm.testnet.iotaledger.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://evm-toolkit.evm.testnet.iotaledger.net"
  ],
  "icon": {
    "url": "ipfs://bafkreibky2sy6qhi6arktayvologkrgu5kudpgdxfkx4uosbvmstz7v4di",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "infoURL": "https://www.iota.org",
  "name": "IOTA EVM Testnet",
  "nativeCurrency": {
    "name": "IOTA",
    "symbol": "IOTA",
    "decimals": 18
  },
  "networkId": 1075,
  "rpc": [
    "https://1075.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.evm.testnet.iotaledger.net"
  ],
  "shortName": "iotaevm-testnet",
  "slug": "iota-evm-testnet",
  "testnet": true,
  "title": "IOTA EVM Testnet"
} as const satisfies Chain;