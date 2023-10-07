import type { Chain } from "../src/types";
export default {
  "chain": "Core",
  "chainId": 1116,
  "explorers": [
    {
      "name": "Core Scan",
      "url": "https://scan.coredao.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmeTQaBCkpbsxNNWTpoNrMsnwnAEf1wYTcn7CiiZGfUXD2",
    "width": 200,
    "height": 217,
    "format": "png"
  },
  "infoURL": "https://www.coredao.org",
  "name": "Core Blockchain Mainnet",
  "nativeCurrency": {
    "name": "Core Blockchain Native Token",
    "symbol": "CORE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://core-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.coredao.org/",
    "https://rpc-core.icecreamswap.com"
  ],
  "shortName": "core",
  "slug": "core-blockchain",
  "testnet": false
} as const satisfies Chain;