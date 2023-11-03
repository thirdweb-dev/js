import type { Chain } from "../types";
export default {
  "chain": "Core",
  "chainId": 1115,
  "explorers": [
    {
      "name": "Core Scan Testnet",
      "url": "https://scan.test.btcs.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmeTQaBCkpbsxNNWTpoNrMsnwnAEf1wYTcn7CiiZGfUXD2",
        "width": 200,
        "height": 217,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://scan.test.btcs.network/faucet"
  ],
  "icon": {
    "url": "ipfs://QmeTQaBCkpbsxNNWTpoNrMsnwnAEf1wYTcn7CiiZGfUXD2",
    "width": 200,
    "height": 217,
    "format": "png"
  },
  "infoURL": "https://www.coredao.org",
  "name": "Core Blockchain Testnet",
  "nativeCurrency": {
    "name": "Core Blockchain Testnet Native Token",
    "symbol": "tCORE",
    "decimals": 18
  },
  "networkId": 1115,
  "rpc": [
    "https://core-blockchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1115.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.btcs.network/"
  ],
  "shortName": "tcore",
  "slug": "core-blockchain-testnet",
  "testnet": true
} as const satisfies Chain;