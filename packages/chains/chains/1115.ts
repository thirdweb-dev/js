import type { Chain } from "../src/types";
export default {
  "chainId": 1115,
  "chain": "Core",
  "name": "Core Blockchain Testnet",
  "rpc": [
    "https://core-blockchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.btcs.network/"
  ],
  "slug": "core-blockchain-testnet",
  "icon": {
    "url": "ipfs://QmeTQaBCkpbsxNNWTpoNrMsnwnAEf1wYTcn7CiiZGfUXD2",
    "width": 200,
    "height": 217,
    "format": "png"
  },
  "faucets": [
    "https://scan.test.btcs.network/faucet"
  ],
  "nativeCurrency": {
    "name": "Core Blockchain Testnet Native Token",
    "symbol": "tCORE",
    "decimals": 18
  },
  "infoURL": "https://www.coredao.org",
  "shortName": "tcore",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Core Scan Testnet",
      "url": "https://scan.test.btcs.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;