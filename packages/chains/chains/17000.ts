import type { Chain } from "../src/types";
export default {
  "name": "Holesky",
  "chain": "ETH",
  "rpc": [
    "https://holesky.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.holesky.ethpandaops.io",
    "https://ethereum-holesky.publicnode.com",
    "wss://ethereum-holesky.publicnode.com"
  ],
  "faucets": [
    "https://faucet.holesky.ethpandaops.io",
    "https://holesky-faucet.pk910.de"
  ],
  "nativeCurrency": {
    "name": "Testnet ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://holesky.ethpandaops.io",
  "shortName": "holesky",
  "chainId": 17000,
  "networkId": 17000,
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "status": "incubating",
  "explorers": [
    {
      "name": "Holesky Explorer",
      "url": "https://holesky.beaconcha.in",
      "icon": {
        "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
        "width": 1000,
        "height": 1628,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "holesky"
} as const satisfies Chain;