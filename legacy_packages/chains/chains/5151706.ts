import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 5151706,
  "explorers": [
    {
      "name": "Explorer",
      "url": "https://explorer.lootchain.com/",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
        "width": 1000,
        "height": 1628,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "infoURL": "https://adventuregold.org/",
  "name": "Loot Chain Mainnet",
  "nativeCurrency": {
    "name": "AGLD",
    "symbol": "AGLD",
    "decimals": 18
  },
  "networkId": 5151706,
  "redFlags": [],
  "rpc": [
    "https://5151706.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lootchain.com/http "
  ],
  "shortName": "AGLD",
  "slug": "loot-chain",
  "testnet": true
} as const satisfies Chain;