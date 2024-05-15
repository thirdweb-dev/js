import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1337803,
  "explorers": [
    {
      "name": "Zhejiang Explorer",
      "url": "https://zhejiang.beaconcha.in",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
        "width": 1000,
        "height": 1628,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.zhejiang.ethpandaops.io",
    "https://zhejiang-faucet.pk910.de"
  ],
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "infoURL": "https://zhejiang.ethpandaops.io",
  "name": "Zhejiang",
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1337803,
  "rpc": [
    "https://1337803.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.zhejiang.ethpandaops.io"
  ],
  "shortName": "zhejiang",
  "slug": "zhejiang",
  "testnet": true
} as const satisfies Chain;