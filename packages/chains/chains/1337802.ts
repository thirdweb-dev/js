import type { Chain } from "../src/types";
export default {
  "chainId": 1337802,
  "chain": "ETH",
  "name": "Kiln",
  "rpc": [
    "https://kiln.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kiln.themerge.dev"
  ],
  "slug": "kiln",
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "faucets": [
    "https://faucet.kiln.themerge.dev",
    "https://kiln-faucet.pk910.de",
    "https://kilnfaucet.com"
  ],
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://kiln.themerge.dev/",
  "shortName": "kiln",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Kiln Explorer",
      "url": "https://explorer.kiln.themerge.dev",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;