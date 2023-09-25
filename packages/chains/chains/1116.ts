import type { Chain } from "../src/types";
export default {
  "chainId": 1116,
  "chain": "Core",
  "name": "Core Blockchain Mainnet",
  "rpc": [
    "https://core-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.coredao.org/",
    "https://rpc-core.icecreamswap.com"
  ],
  "slug": "core-blockchain",
  "icon": {
    "url": "ipfs://QmeTQaBCkpbsxNNWTpoNrMsnwnAEf1wYTcn7CiiZGfUXD2",
    "width": 200,
    "height": 217,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Core Blockchain Native Token",
    "symbol": "CORE",
    "decimals": 18
  },
  "infoURL": "https://www.coredao.org",
  "shortName": "core",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Core Scan",
      "url": "https://scan.coredao.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;