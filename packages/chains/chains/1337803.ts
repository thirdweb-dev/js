import type { Chain } from "../src/types";
export default {
  "chainId": 1337803,
  "chain": "ETH",
  "name": "Zhejiang",
  "rpc": [
    "https://zhejiang.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zhejiang.ethpandaops.io"
  ],
  "slug": "zhejiang",
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "faucets": [
    "https://faucet.zhejiang.ethpandaops.io",
    "https://zhejiang-faucet.pk910.de"
  ],
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://zhejiang.ethpandaops.io",
  "shortName": "zhejiang",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Zhejiang Explorer",
      "url": "https://zhejiang.beaconcha.in",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;