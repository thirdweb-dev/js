import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1337802,
  "explorers": [
    {
      "name": "Kiln Explorer",
      "url": "https://explorer.kiln.themerge.dev",
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
    "https://faucet.kiln.themerge.dev",
    "https://kiln-faucet.pk910.de",
    "https://kilnfaucet.com"
  ],
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "infoURL": "https://kiln.themerge.dev/",
  "name": "Kiln",
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1337802,
  "rpc": [
    "https://kiln.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1337802.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kiln.themerge.dev"
  ],
  "shortName": "kiln",
  "slug": "kiln",
  "testnet": true
} as const satisfies Chain;